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
    title: 'Data',
    role: 'admin',
    items: [{
      title: 'Users',
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
      title: 'Supplier',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'supplier-list',
        role: 'admin'
      },
    }],
  }, {
    title: 'Keuangan',
    role: 'user',
    items: [{
      title: 'Asumsi Keuangan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-asumsi-keuangan-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Neraca Keuangan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-neraca-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Laba Rugi',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-laba-rugi-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Harga Pokok Penjualan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-harga-pokok-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Arus Kas',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-arus-kas-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Investasi',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-investasi-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Penerimaan Negara',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-penerimaan-negara-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Keuangan Lainnya',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-keuangan-lainnya-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Sumber Pembiayaan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-sumber-pembiayaan-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Anggaran Belanja',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-anggaran-belanja-op',
        tahapan_kegiatan: 'Operasi Produksi',
        forbidden: 'admin'
      },
    }, {
      title: 'Asumsi Keuangan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-asumsi-keuangan-eksplorasi',
        tahapan_kegiatan: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Neraca Keuangan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-neraca-eksplorasi',
        tahapan_kegiatan: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Laba Rugi',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-laba-rugi-eksplorasi',
        tahapan_kegiatan: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Arus Kas',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-arus-kas-eksplorasi',
        tahapan_kegiatan: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Investasi',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-investasi-eksplorasi',
        tahapan_kegiatan: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Penerimaan Negara',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-penerimaan-negara-eksplorasi',
        tahapan_kegiatan: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Keuangan Lainnya',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-keuangan-lainnya-eksplorasi',
        tahapan_kegiatan: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Anggaran Belanja',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-anggaran-belanja-eksplorasi',
        tahapan_kegiatan: 'Eksplorasi',
        forbidden: 'admin'
      },
    }, {
      title: 'Sumber Pembiayaan',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'csv-sumber-pembiayaan-eksplorasi',
        tahapan_kegiatan: 'Eksplorasi',
        forbidden: 'admin'
      },
    }],
  }, {
    title: 'Barang',
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
  }, {
    title: 'Miscellaneous',
    items: [{
      title: 'Overview',
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: {
        name: 'components-overview',
      },
    }, {
      title: 'Add New Post',
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: {
        name: 'add-new-post',
      },
    }, {
      title: 'Blog Posts',
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: {
        name: 'blog-posts',
      },
    }],
  },
  ];
}
