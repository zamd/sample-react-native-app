import React, {Component} from 'react';
import {
    Container,
    Content,
    Text,
    Title,
    Spinner,
    Header,
    Footer,
    Left,
    Right,
    Button,
    Icon,
    Body
} from 'native-base';
import {flatten} from 'lodash';
import jwt_decode from 'jwt-decode';

import AccountView from './accountView';
import AccountLink from './accountLink';

import env from '../env';

const Claims = {
    BillingAccount: "https://linkedIdentity.telstra.com/ban",
    BusinessAccount: "https://linkedIdentity.telstra.com/abn"
};

const Task = {
    Done: output => new Promise(resolve => resolve(output))
};

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            accounts: []
        }
    }

    updateState = delta => {
        this.setState(Object.assign(this.state, delta));
        console.log(this.state);
    }

    async getAccount(url) {
        const response = await fetch(url, {
            method: "get",
            headers: {
                'Authorization': `Bearer ${this.props.access_token}`
            }
        });

        return await response.json();
    }

    getBillingAccount(ban) {
        return this.getAccount(`${env.baseUrlOfCrm}/byban/${ban}`);
    }
    getBusinessAccount(abn) {
        return this.getAccount(`${env.baseUrlOfCrm}/byabn/${abn}`);
    }

    async getAccounts() {
        this.updateState({fetchInProgress: true});

        const profile = jwt_decode(this.props.access_token);
        let bans = profile[Claims.BillingAccount];

        const loaders = bans
            .split(' ')
            .map(ban => this.getBillingAccount(ban));
        const accounts = flatten(await Promise.all(loaders));

        // const banTask = ban ? this.getBillingAccount(ban) : Task.Done(),
        // abnTask = abn ? this.getBusinessAccount(abn) : Task.Done(); // concurrent
        // fetch... const consumerAccount = await banTask; const businessAccount = await
        // abnTask;

        this.updateState({fetchInProgress: false, accounts});
    }

    componentDidMount() {
        this.getAccounts();
    }

    toggleAddAccount = () => {
        this.updateState({addAccount: !this.state.addAccount})
    }

    linkAccount = account => {
        console.log('linking....');
        this.updateState({addAccount: false, accounts: [...this.state.accounts,account]});
    }

    renderLoading() {
        return (
            <Content>
                <Text
                    style={{
                    marginBottom: 10,
                    marginTop: 10,
                    fontWeight: '800',
                    color: '#5357b6'
                }}>Loading your accounts...</Text>
                <Spinner color='red'/>
            </Content>
        );
    }

    renderAccounts() {
        let k = 1;
        //TODO: use acc.id as key...
        return this
            .state
            .accounts
            .map(acc =>< AccountView key = {
                k++
            }
            account = {
                acc
            } />);
    }

    render() {
        if (this.state.addAccount)
            return <AccountLink onClose={this.toggleAddAccount} onLink={this.linkAccount}/>;
        return (
            <Container>
                <Header>
                    <Left/>
                    <Body>
                        <Text>Accounts Dashboard</Text>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    {this.state.fetchInProgress
                        ? this.renderLoading()
                        : this.renderAccounts()}
                </Content>
                <Footer>
                    <Button transparent onPress={this.toggleAddAccount}>
                        <Text>Add Account</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}

export default Dashboard;