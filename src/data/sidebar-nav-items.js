export default function () {
  return [{
    title: 'Dashboards',
    role: 'admin',
    items: [{
      title: 'Analytics',
      to: {
        name: 'analytics',
        role: 'admin'
      },
      htmlBefore: '<i class="material-icons">&#xE917;</i>',
      htmlAfter: '',
    }],
  },
  {
    title: 'Users',
    role: 'admin',
    items: [{
      title: 'Staff',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'users',
        role: 'admin'
      },
    }, {
      title: 'Companies',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'company-list',
        role: 'admin'
      },
    }, {
      title: 'Producer',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'supplier-list',
        role: 'admin'
      },
    }],
  }, {
    title: 'MineFin',
    role: 'user',
    items: [{
      title: 'Input Data Keuangan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'xls-keuangan-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }],
  }, {
    title: 'MinePedia',
    items: [{
      title: 'Input Belanja Barang',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-belanja-barang',
        role: 'user'
      },
    }, {
      title: 'Rekap Belanja Barang Total',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'rekap-belanja-barang-total',
        role: 'admin'
      },
    }, {
      title: 'Manage Barang',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'commerce',
        forbidden: 'user'
      },
    }, {
      title: 'List Barang',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'list-commerce',
      },
    }, {
      title: 'Input Barang',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'add-commerce',
        role: 'supplier'
      },
    }],
  }];
}
