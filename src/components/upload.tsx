import * as dateformat from 'dateformat';
import * as _ from 'lodash';
import * as React from 'react';

import existClient from '../lib/exist_client';
import './upload.css';

// Whoo types!
const CSVReader = require('react-csv-reader'); // tslint:disable-line

import { Auth } from '../lib/auth';
import LoggedComponent from '../lib/logged_component';

class UploadCsvComponent extends LoggedComponent<UploadCsvComponent.IProps, UploadCsvComponent.IState> {
  public state = {
    uploading: false,
  };

  public render() {
    if (this.state.uploading) {
      return <div>Please wait...</div>;
    }

    return (
      <div className="upload-wrapper">
        <CSVReader.default
          cssClass="csv-input"
          label="Select CSV with Mint transactions"
          onFileLoaded={this.onUpload}
          onError={this.onUploadError}
          inputId="Transactions"
        />
      </div>
    );
  }

  private async onUpload(rows: any[]) {
    const accessToken = this.props.auth.getExistAccessToken();
    if (!accessToken) {
      alert(`Cannot upload transactions without logging in.`);
      return;
    }

    // Use the header row to validate input.
    if (rows[0][0] !== 'Date' || rows[0][3] !== 'Amount' || rows[0][4] !== 'Transaction Type') {
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
    if (attributes.length > 100) {
      attributes = attributes.slice(0, 100);
    }

    this.log.info(attributes);

    if (!confirm(`Are you sure you want to upload ${attributes.length} days worth of data to Exist?`)) {
      return;
    }

    this.setState({ uploading: true });
    try {
      await existClient.updateMoneySpent(accessToken, attributes);
    } finally {
      this.setState({ uploading: false });
    }
  }

  /**
   * Extract the data we care about from the CSV.
   */
  private parseRow(row: string[]): { date: string; amount: number } | null {
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
}

namespace UploadCsvComponent {
  export interface IProps {
    auth: Auth;
  }

  export interface IState {
    uploading: boolean;
  }
}

export default UploadCsvComponent;
