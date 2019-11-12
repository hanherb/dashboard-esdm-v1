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
      title: 'Asumsi Keuangan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-asumsi-keuangan-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Neraca Keuangan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-neraca-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Laba Rugi',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-laba-rugi-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Harga Pokok Penjualan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-harga-pokok-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Arus Kas',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-arus-kas-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Investasi',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-investasi-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Penerimaan Negara',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-penerimaan-negara-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Keuangan Lainnya',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-keuangan-lainnya-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Sumber Pembiayaan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-sumber-pembiayaan-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Anggaran Belanja',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-anggaran-belanja-op',
        company_type: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Asumsi Keuangan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-asumsi-keuangan-eksplorasi',
        company_type: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Neraca Keuangan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-neraca-eksplorasi',
        company_type: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Laba Rugi',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-laba-rugi-eksplorasi',
        company_type: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Arus Kas',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-arus-kas-eksplorasi',
        company_type: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Investasi',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-investasi-eksplorasi',
        company_type: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Penerimaan Negara',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-penerimaan-negara-eksplorasi',
        company_type: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Keuangan Lainnya',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-keuangan-lainnya-eksplorasi',
        company_type: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Anggaran Belanja',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-anggaran-belanja-eksplorasi',
        company_type: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Sumber Pembiayaan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-sumber-pembiayaan-eksplorasi',
        company_type: 'Eksplorasi',
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
