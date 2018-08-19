import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';

import './faq.css';

import LoggedComponent from '../lib/logged_component';

export default class FaqComponent extends LoggedComponent {
  public render() {
    return (
      <div className="content">
        <Typography variant="title" align="center">
          FAQ
        </Typography>
        <p />
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subheading">What is this?</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              This app is a tool that allows you to sync data from Mint to Exist.
              <p />
              <a target="_blank" href="https://www.mint.com">
                Mint
              </a>{' '}
              is a tool used for budgeting and fincacial organiztion.
              <br />
              <a target="_blank" href="https://www.exist.io">
                Exist
              </a>{' '}
              is a tool to help find trends and relationships between various sources of personal data.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subheading">Do you store any of my data?</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              No! This tool runs entirely in your browser. Your financial data is never sent anywhere. You can check out
              the source code on{' '}
              <a target="_blank" href="https://github.com/jmoseley/exist_finance">
                Github
              </a>
              .
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subheading">Are you affiliated with Exist?</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Nope. I am just a guy that wanted to make more of my data accessible to Exist, and thought other people
              might want to do that too.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subheading">Do you track me?</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              I use a service called{' '}
              <a target="_blank" href="https://clicky.com/">
                Clicky
              </a>{' '}
              because I am interested in how many people use my thing.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subheading">I have other questions!</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Hit me up via email (jeremy AT jeremymoseley DOT net), or file an issue on{' '}
              <a target="_blank" href="https://github.com/jmoseley/exist_finance/issues">
                Gituhb
              </a>
              .
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}
