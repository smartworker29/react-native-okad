/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {setAction} from '@redux/actions';
import {Icon} from 'react-native-elements';
import {useQuery} from '@apollo/client';

import type {ThemeStyle as StyleType, ThemeStyle} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';

import {Contact, TableHeaderType, TableSortOps} from '@utils/types';
import {phoneFormat} from '@utils/functions';

import {
  AppHeader,
  AppGradButton,
  AppSearchInput,
  AppTextButton,
  AppText,
  AppDataTable,
  CircularLoading,
} from '@root/components';
import {FETCH_CONTACTS} from './graphql';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';

const HEADERS: TableHeaderType[] = [
  {label: 'Name', value: 'name', sortable: true, style: {width: 220}},
  {label: 'Location', value: 'location', sortable: true, style: {flex: 1}},
  {
    label: 'Phone Number',
    value: 'phoneNumber',
    sortable: true,
    style: {flex: 1},
  },
  {label: '', value: 'actions', sortable: false, style: {flex: 1}},
];

const sortContact = (arr: Contact[], sortOp: TableSortOps) => {
  const sorted = arr.sort((a: Contact, b: Contact) => {
    let cmpA = '',
      cmpB = '';
    switch (sortOp.sortBy) {
      case 'phoneNumber':
        cmpA = (
          a.phone_mobile ||
          a.phone_home ||
          a.phone_office ||
          ''
        ).toUpperCase();
        cmpB = (
          b.phone_mobile ||
          b.phone_home ||
          b.phone_office ||
          ''
        ).toUpperCase();
        break;
      case 'location':
        cmpA = (a.address.city + ', ' + a.address.us_state).toUpperCase();
        cmpB = (b.address.city + ', ' + b.address.us_state).toUpperCase();
        break;
      case 'name':
        cmpA = (a.name_first + ' ' + a.name_last).toUpperCase();
        cmpB = (b.name_first + ' ' + b.name_last).toUpperCase();
        break;
      default:
    }
    let comparison = 0;
    if (cmpA > cmpB) {
      comparison = 1;
    } else if (cmpA < cmpB) {
      comparison = -1;
    }
    return comparison;
  });
  if (sortOp.sortOrder === 'DESC') {
    sorted.reverse();
  }
  return sorted;
};

const cellContent = (
  header: TableHeaderType,
  row: Contact,
  styles: any,
  themeStyle: ThemeStyle,
  navigation: any,
) => {
  switch (header.value) {
    case 'name':
      return (
        <AppTextButton
          style={styles.cellLayout}
          onPress={() =>
            navigation.navigate(AppRouteEnum.ContactDetails, {
              itemId: row.id,
              itemTitle: `${row.name_first} ${row.name_last}`,
            })
          }>
          <AppText
            style={styles.noSpacing}
            color={'textPurple'}
            size={20}
            font={'anSemiBold'}>
            <>
              {row.name_first} {row.name_last}
            </>
          </AppText>
        </AppTextButton>
      );
    case 'location':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {`${row.address.city}, ${row.address.us_state}`}
          </AppText>
        </View>
      );
    case 'phoneNumber':
      const phone_number =
        row.phone_mobile || row.phone_home || row.phone_office || '';
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {phoneFormat(phone_number)}
          </AppText>
        </View>
      );
    case 'actions':
      const count = row.agreements ? row.agreements.length : 0;
      if (count) {
        return (
          <AppTextButton
            style={{...styles.cellLayout, ...styles.agreementsBtn}}
            leftIconContent={<></>}>
            <AppText
              style={styles.noSpacing}
              color={'textPurple'}
              size={20}
              font={'anSemiBold'}>
              {count > 1 ? `${count} agreements` : `${count} agreement`}
            </AppText>
          </AppTextButton>
        );
      }
      return (
        <AppTextButton
          style={{...styles.cellLayout, ...styles.agreementsBtn}}
          onPress={() =>
            navigation.navigate('NewAgreement', {parent: 'Contacts'})
          }
          leftIconContent={
            <Icon
              color={themeStyle.textPurple}
              name={'pluscircleo'}
              type={'antdesign'}
              size={20}
            />
          }>
          <AppText
            style={styles.noSpacing}
            color={'textPurple'}
            size={20}
            font={'anSemiBold'}>
            New agreement
          </AppText>
        </AppTextButton>
      );
    default:
      return <></>;
  }
};

export default function Contacts({navigation}: ContactsNavProps) {
  const {themeStyle} = useTheme();
  const {styles} = useStyles(getStyles);

  const contacts = useSelector((state: any) => state.contacts);
  const contactsSortOps = contacts.sortOp;
  const {error, loading} = useQuery(FETCH_CONTACTS, {
    onCompleted: (data) => {
      setSearchText('');
      const newData = contacts.contacts.concat(data.contacts);
      setAction('contacts', {
        contacts: newData,
      });
      setVisibleContacts(newData);
    },
  });
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [visibleContacts, setVisibleContacts] = useState<Contact[]>(
    contacts.contacts,
  );

  const onSortChanged = (sortOp: TableSortOps) => {
    let sorted = sortContact(contacts.contacts, sortOp);
    setVisibleContacts(sorted);
    setAction('contacts', {sortOp});
  };

  const onFilterContact = (text: string) => {
    const filteredContacts = contacts.contacts.filter(
      (contact: Contact) =>
        `${contact.name_first} ${contact.name_last}`
          .toLowerCase()
          .indexOf(text.toLowerCase()) > -1,
    );
    const sorted = sortContact(filteredContacts, contactsSortOps);
    setVisibleContacts(sorted);
    setSearchText(text);
  };

  const renderCell = React.useCallback(
    (header: TableHeaderType, row: Contact) =>
      cellContent(header, row, styles, themeStyle, navigation),
    [contacts],
  );

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading Error</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={null}
        rightContent={null}
        pageTitle={'Contacts'}
        toolbarCenterContent={
          <TouchableOpacity style={styles.flexlayout}>
            <AppGradButton
              title={'NEW'}
              onPress={() =>
                navigation.navigate(AppRouteEnum.NewContactModal, {})
              }
              leftIconContent={
                <Icon
                  color={themeStyle.textWhite}
                  name={'pluscircle'}
                  type={'antdesign'}
                  size={22}
                />
              }
            />
          </TouchableOpacity>
        }
        toolbarRightContent={
          <AppSearchInput value={searchText} onChange={onFilterContact} />
        }
      />
      <AppDataTable
        headers={HEADERS}
        key={visibleContacts.length || contactsSortOps}
        sortOp={contactsSortOps}
        renderCell={renderCell}
        rows={visibleContacts}
        onSortChanged={onSortChanged}
      />
      <CircularLoading loading={loading} />
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18,
    }),
  },
  agreementsBtn: {
    justifyContent: 'flex-end',
  },
  flexlayout: {
    flexDirection: 'row',
  },
  cellLayout: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    height: 40,
  },
  noSpacing: {
    letterSpacing: 0,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 250,
  },
});
