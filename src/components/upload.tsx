import { Checkbox, FormControlLabel, Grid, IconButton, Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import * as dateformat from 'dateformat';
import * as _ from 'lodash';
import * as React from 'react';

import existClient from '../lib/exist_client';
import './upload.css';

// Whoo types!
const CSVReader = require('react-csv-reader'); // tslint:disable-line

const MAX_BACKLOG = 100; // days

const PAYCHECK_CATEGORY = 'Paycheck';

import { Auth } from '../lib/auth';
import LoggedComponent from '../lib/logged_component';
import PreferenceStore, { Preferences } from '../lib/preferences';

class UploadCsvComponent extends LoggedComponent<UploadCsvComponent.IProps, UploadCsvComponent.IState> {
  public state = {
    // todo: Redux or something.
    filterPaycheck: PreferenceStore.getPreference(Preferences.Names.FILTER_PAYCHECKS),
    tagPaychecks: PreferenceStore.getPreference(Preferences.Names.TAG_PAYCHECK),
    uploading: false,
  };

  public render() {
    return (
      <Grid container={true} alignItems="center" justify="center">
        {this.state.uploading && <div className="csv-input">Please wait...</div>}
        {!this.state.uploading && (
          <div>
            <Grid xs={12} item={true}>
              <Grid container={true} alignItems="center" justify="center">
                <CSVReader.default
                  cssClass="csv-input"
                  label="Select CSV with Mint transactions"
                  onFileLoaded={this.onUpload}
                  onError={this.onUploadError}
                  inputId="Transactions"
                />
              </Grid>
            </Grid>
            <Grid xs={12} item={true}>
              <FormControlLabel
                control={
                  <Checkbox color="primary" checked={this.state.tagPaychecks} onChange={this.onChangeTagPaychecks} />
                }
                label="Tag Paychecks"
              />
              <Tooltip title="This will add a tag to all days that are recognized as pay day. This is based on the category in Mint, &quot;Paycheck&quot;.">
                <IconButton aria-label="Help">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid xs={12} item={true}>
              <FormControlLabel
                control={
                  <Checkbox color="primary" checked={this.state.filterPaycheck} onChange={this.onChangeFilterCredit} />
                }
                label="Filter Paychecks"
              />
              <Tooltip title="This will filter out all paychecks from the aggregation of money spent. Provides a more reaslistic view of spending as opposed to keeping a balance.">
                <IconButton aria-label="Help">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </div>
        )}
      </Grid>
    );
  }

  private async onUpload(rows: any[]) {
    const accessToken = this.props.auth.getExistAccessToken();
    if (!accessToken) {
      alert(`Cannot upload transactions without logging in.`);
      return;
    }

    // Use the header row to validate input.
    if (
      rows[0][0] !== 'Date' ||
      rows[0][3] !== 'Amount' ||
      rows[0][4] !== 'Transaction Type' ||
      rows[0][5] !== 'Category'
    ) {
      alert('Invalid CSV uploaded.');
      return;
    }

    // Slice off the header.
    rows = rows.slice(1);

    const transactionsByDate = _(rows)
      .map(this.parseRow)
      .compact()
      .groupBy('date')
      .value();

    const aggregated = _.mapValues(transactionsByDate, (transactions) => {
      return _(transactions)
        .filter((t) => !this.state.filterPaycheck || (this.state.filterPaycheck && t.category !== PAYCHECK_CATEGORY))
        .map('amount')
        .sum();
    });

    let attributes = _(aggregated)
      .keys()
      .map((key) => {
        return {
          date: key,
          value: aggregated[key],
        };
      })
      .value();

    // Cap at 100 days worth of data.
    if (attributes.length > MAX_BACKLOG) {
      attributes = attributes.slice(0, MAX_BACKLOG);
    }

    if (!confirm(`Are you sure you want to upload ${attributes.length} days worth of data to Exist?`)) {
      return;
    }

    const submittedDates = new Set(_.map(attributes, (attr) => attr.date));

    this.setState({ uploading: true });
    try {
      this.log.info(`Submitting attributes: ${JSON.stringify(attributes)}`);
      const attributeResult = await existClient.updateMoneySpent(accessToken, attributes);
      this.log.info(`Result: ${JSON.stringify(attributeResult)}`);

      if (this.state.tagPaychecks) {
        const payCheckDays = _(transactionsByDate)
          .toPairs()
          .map(([date, transactions]) => {
            return _.some(transactions, (t) => t.category === PAYCHECK_CATEGORY) ? date : null;
          })
          .filter((dateStr) => {
            if (!dateStr) {
              return false;
            }

            return submittedDates.has(dateStr);
          })
          .compact()
          .value();

        this.log.info(`Tagging Days for paychecks: ${JSON.stringify(payCheckDays)}`);
        const tagResult = await existClient.tagPaychecks(accessToken, payCheckDays);
        this.log.info(`Result: ${JSON.stringify(tagResult)}`);
      }
    } finally {
      this.setState({ uploading: false });
    }
  }

  /**
   * Extract the data we care about from the CSV.
   */
  private parseRow(row: string[]): { date: string; amount: number; category: string } | null {
    try {
      const date = new Date(row[0]);

      if (!row[0] || !row[3] || isNaN(date.getTime()) || (row[4] !== 'credit' && row[4] !== 'debit')) {
        this.log.warn(`Invalid row: '${row.join(',')}' with length: ${row.length}`);
        return null;
      }

      let amount = parseFloat(row[3]);
      if (row[4] === 'credit') {
        amount = -amount;
      }

      return {
        amount,
        category: row[5],
        date: dateformat(date, 'yyyy-mm-dd'),
      };
    } catch (error) {
      this.log.error(`Unable to parse row: ${row.join(',')}`);
      this.log.error(error);

      return null;
    }
  }

  private onUploadError(error: any) {
    this.log.error(error);
  }

  private onChangeTagPaychecks(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    // todo: Redux or something to keep these linked.
    PreferenceStore.setPreference(Preferences.Names.TAG_PAYCHECK, checked);
    this.setState({ ...this.state, tagPaychecks: checked });
  }

  private onChangeFilterCredit(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    // todo: Redux or something to keep these linked.
    PreferenceStore.setPreference(Preferences.Names.FILTER_PAYCHECKS, checked);
    this.setState({ ...this.state, filterPaycheck: checked });
  }
}

namespace UploadCsvComponent {
  export interface IProps {
    auth: Auth;
  }

  export interface IState {
    uploading: boolean;
    tagPaychecks: boolean;
    filterPaycheck: boolean;
  }
}

export default UploadCsvComponent;
