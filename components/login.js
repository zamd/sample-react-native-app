import React, {Component} from 'react';
import {Linking} from 'react-native';
import {
    Container,
    Header,
    Body,
    Left,
    Right,
    Content,
    Footer,
    Text,
    Button,
    Icon,
    Spinner,
    ListItem,
    CheckBox,
    Picker,
    Item
} from 'native-base';
import {WebBrowser} from 'expo';

import urljoin from 'url-join';
import qs from 'qs';
import url from 'url';
import env from '../env';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            loginInProcess: false
        }
    }
    async componentDidMount() {
        Linking.addEventListener('url', this.handleCallback);
    }

    // TODO: Enable PKCE... base64URLEncode(str) {     return str.toString('base64')
    //         .replace(/\+/g, '-')         .replace(/\//g, '_')
    // .replace(/=/g, ''); } sha256(buffer) {     return
    // crypto.createHash('sha256').update(buffer).digest(); }

    buildAuthorizeUrl() {

        // const verifier = this.base64URLEncode(crypto.randomBytes(32)),
        // challenge = this.base64URLEncode(this.sha256(verifier));

        const params = {
            response_type: 'code',
            // code_challenge: challenge, code_challenge_method: "S256",
            redirect_uri: env.redirectUri,
            client_id: env.clientID,
            state: env.redirectUri,
            scope: env.scope,
            audience: env.audience
        };
        if (this.props.silent) { // slientAuth
            console.log('doing silient auth....');
            params.prompt = "none";
        }
        const baseUrl = `https://${env.domain}`,
            query = qs.stringify(params);

        return urljoin(baseUrl, `authorize`, `?` + query);
    }
    updateState = delta => {
        this.setState(Object.assign(this.state, delta));
    }

    startLogin = async() => {
        this.updateState({loginInProcess: true});

        const url = this.buildAuthorizeUrl();
        console.log(`browsing: ${url}`);
        let open = await WebBrowser.openBrowserAsync(url);
        if (open.cancel) {}
    }

    handleCallback = async(event) => {
        await WebBrowser.dismissBrowser();
        const response = url.parse(event.url, true);
        const code = response.query.code; //TODO error handling...

        if (code) {
            const payload = JSON.stringify({
                grant_type: 'authorization_code',
                code: code,
                client_id: env.clientID,
                redirect_uri: env.redirectUri,
                scope: env.scope,
                audience: env.audience
            });

            console.log(payload);

            let res = await fetch(`https://${env.domain}/oauth/token`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: payload
            });
            if (res.status === 200) {
                const {id_token, access_token} = await res.json();
                this.updateState({loginInProcess: false});
                this.props.onComplete({id_token, access_token});
            } else { //handle failure...
                console.log(res);
                this.updateState({loginInProcess: false});
            }
        }

    }

    render() {
        return (
            <Container>
                <Header>
                    <Left/>
                    <Body>
                        <Text>Welcome</Text>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <Text style={{fontWeight: '600', marginTop:100, marginLeft:5}}>Welcome to Telstra Selfcare Application. Please login to continue</Text>
                    {
                        this.state.loginInProcess ? <Spinner/> :
                        <Button style={{margin: 20, marginTop:50}}onPress={this.startLogin}>
                            <Icon name="person"/> 
                            {
                                this.props.silent ? <Text>Silent Login</Text>
                                : <Text>Login with Auth0</Text>
                            }
                        </Button>
                    }
                </Content>
                <Footer>
                    <Text style={{marginTop:10}}>Telstra self-care</Text>
                </Footer>
            </Container>
        );
    }
}

export default Login;