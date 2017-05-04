import React from 'react';
import {Content, Text, Button} from 'native-base';

import JSONTree from 'react-native-json-tree';

export default AccountView = (props) => {
    if (props.account) {
        return (
            <Content>
                <Text
                    style={{
                    marginBottom: 10,
                    marginTop: 10,
                    fontWeight: '800',
                    color: '#5357b6'
                }}>{props.account.AccountType}
                    Account</Text>

                <Text>Title: {props.account.ContactTitle}</Text>
                <Text>First Name: {props.account.ContactFirstName}</Text>
                <Text>Last Name: {props.account.ContactLastName}</Text>
                <Text>Mobile Number: {props.account.ContactHomeMobile}</Text>
                <Text>Driver License: {props.account.DriverLicence}</Text>
                <Text>License State: {props.account.DriverLicenceState}</Text>
                {/*<JSONTree data={props.account}/>*/}
            </Content>
        );
    }

    return <Content/>
}