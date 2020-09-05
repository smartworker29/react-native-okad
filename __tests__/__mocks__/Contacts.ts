export const CONTACTS_MOCKDATA = {
  contacts: [
    {
      id: 1,
      email: 'alana.nitzsche44@gmail.com',
      name_first: 'Irving',
      name_last: 'Marvin',
      title: 'Mrs.',
      company: 'Jacobs LLC',
      phone_home: '+18581950948',
      phone_mobile: '+18653374781',
      phone_office: null,
      address_id: 7,
      address: {
        city: 'Andersonhaven',
        lat: null,
        id: 7,
        county: null,
        line1: '0558 Jacobi Street',
        line2: 'Apt 4A',
        postal_code: '49001',
        us_state: 'AR',
      },
      agreements: [
        {
          agreement_events: [],
          address: {
            city: 'North Chandlerfurt',
            county: null,
            id: 4,
            line1: '0391 Zieme Parks',
            line2: 'Bldg C',
            us_state: 'SD',
            postal_code: '85831',
          },
          addressByShippingAddressId: null,
          contact: {
            name_first: 'Irving',
            name_last: 'Marvin',
            id: 1,
          },
          contact_id: 1,
          line_items: [
            {
              agreement_id: 10,
              catalog_item_id: 1,
              current_cost: 328222,
              discount: 20000,
              price: 496279,
              qty: 1,
              id: 25,
              catalog_item: {
                name: 'Elan SRE-3050',
              },
            },
            {
              agreement_id: 10,
              catalog_item_id: 3,
              current_cost: 316186,
              discount: 20000,
              price: 531804,
              qty: 1,
              id: 26,
              catalog_item: {
                name: "20' Rail Installation Kit",
              },
            },
          ],
          number: 'PF3057',
          revision: 0,
          sales_tax_rate: 8.5,
          shipping_address_id: null,
          signature: null,
          user: {
            prefix: 'PK',
            prefs: {
              passcode: null,
            },
            public_id: '9c6b8c19-4b63-490b-a1e9-7639c01097e8',
            name_last: 'Kuhn',
            name_first: 'Paul',
            google_id: null,
            email: 'winona.harber@hotmail.com',
            default_sales_tax_rate: 9,
            organization_id: 4,
          },
          user_id: 9,
        },
      ],
    },
  ],
};
