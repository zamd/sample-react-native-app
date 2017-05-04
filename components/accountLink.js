import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Modal, Image, Platform} from 'react-native';
import {
    Left,
    Right,
    Body,
    Spinner,
    Text,
    View,
    Content,
    Container,
    Header,
    Footer,
    Title,
    Button,
    Icon,
    InputGroup,
    Input,
    ListItem,
    List,
    Radio,
    CheckBox,
    Thumbnail,
    Card,
    CardItem,
    H3
} from 'native-base';

import env from '../env';

class AccountLink extends Component {
    constructor() {
        super();

        this.state = {
            search: "11000000000",
            results: {},
            detailsVisible: false
        }
    }
    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Body>
                        <InputGroup>
                            <Icon name="ios-search"/>
                            <Input
                                placeholder="ABN"
                                value={this.state.search}
                                onChangeText={(text) => this.updateState({search: text})}
                                onSubmitEditing={() => this.search()}/>
                        </InputGroup>
                    </Body>
                    <Button transparent onPress={() => this.search()}>
                        <Text>Search</Text>
                    </Button>
                </Header>
                <Content>
                    {this.state.loading
                        ? <Spinner/>
                        : <List
                            dataArray={this.state.accounts}
                            renderRow={(acc) => <ListItem button onPress={() => this.showDetails(true, acc)}>
                            <Left>
                                <Text
                                    style={{
                                    fontWeight: '600',
                                    color: '#46ee4b'
                                }}>{acc.BillingAccountNumber}</Text>
                            </Left>
                            <Body>
                                <Text
                                    style={{
                                    color: '#007594'
                                }}>{acc.ContactFirstName + " " + acc.ContactLastName}</Text>
                                <Text note>
                                    <Text
                                        note
                                        style={{
                                        marginTop: 5
                                    }}>{acc.ContactBirthDate}</Text>
                                </Text>
                            </Body>
                        </ListItem>}/>}
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.detailsVisible}
                        onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}>
                        {!this.state.selectedItem
                            ? <View/>
                            : <Card
                                style={{
                                paddingTop: 20
                            }}>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <H3 style={styles.header}>
                                        {this.state.selectedItem.AccountType}
                                    </H3>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text >
                                        ABN:
                                        <Text style={styles.bold}>{this.state.selectedItem.ABN}</Text>
                                    </Text>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text >
                                        Account Number:
                                        <Text style={styles.bold}>{this.state.selectedItem.BillingAccountNumber}</Text>
                                    </Text>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text >
                                        DOB:
                                        <Text style={styles.bold}>{this.state.selectedItem.ContactBirthDate}</Text>
                                    </Text>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text >
                                        First Name:
                                        <Text style={styles.bold}>{this.state.selectedItem.ContactFirstName}</Text>
                                    </Text>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text >
                                        Email:
                                        <Text style={styles.bold}>{this.state.selectedItem.ContactHomeEmail}</Text>
                                    </Text>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text>
                                        Mobile:
                                        <Text style={styles.bold}>{this.state.selectedItem.ContactHomeMobile}</Text>
                                    </Text>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text>
                                        Home Phone:
                                        <Text style={styles.bold}>{this.state.selectedItem.ContactHomePhone}</Text>
                                    </Text>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text>
                                        License:
                                        <Text style={styles.bold}>{this.state.selectedItem.DriverLicence}</Text>
                                    </Text>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text>
                                        Issuer:
                                        <Text style={styles.bold}>{this.state.selectedItem.DriverLicenceState}</Text>
                                    </Text>
                                </CardItem>
                                <CardItem
                                    cardBody
                                    style={{
                                    justifyContent: 'flex-start'
                                }}>

                                    <Button
                                        success
                                        style={{
                                        alignSelf: 'flex-end', margin: 5
                                    }}
                                        onPress={() => this.linkAccount(this.state.selectedItem)}>
                                        <Text>Link Account</Text>
                                    </Button>

                                    <Button
                                        danger
                                        style={{
                                        alignSelf: 'flex-end', margin: 5
                                    }}
                                        onPress={() => this.showDetails(!this.state.detailsVisible, this.state.selectedItem)}>
                                        <Text>Cancel</Text>
                                    </Button>
                                </CardItem>
                            </Card>
}
                    </Modal>
                </Content>
                <Footer>
                    <Button
                        danger
                        style={{
                        alignSelf: 'flex-end', margin: 5
                    }}
                        onPress={this.onGoBack}>
                        <Text>Go Back</Text>
                    </Button>
                </Footer>
            </Container>
        );
    }

    updateState = delta => {
        this.setState(Object.assign(this.state, delta));
        console.log(this.state);
    }
    showDetails = (show, acc) => {
        this.updateState({detailsVisible: show, selectedItem: acc});
    }

    onGoBack = () => {
        this.props.onClose();
    }

    linkAccount = (acc) => {
        this.updateState({detailsVisible: false});
        this.props.onLink(acc);
    }

    search = async() => {
        this.updateState({loading: true});
        try {
            const accounts = await fetch(`${env.baseUrlOfCrm}/byabn/${this.state.search}`).then(r => r.json());
            this.updateState({loading: false, accounts});
        } catch (err) {
            this.updateState({loading: false});
        }
    }

}

const styles = {
    header: {
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 10,
        lineHeight: 24,
        color: '#5357b6'
    },
    modalImage: {
        resizeMode: 'contain',
        height: 200
    },
    bold: {
        fontWeight: '600'
    },
    negativeMargin: {
        marginBottom: -10
    }
};

export default AccountLink;