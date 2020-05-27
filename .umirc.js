// ref: https://umijs.org/config/

export default {
  treeShaking: true,
  history: 'hash',
  publicPath: '/',
  theme: {
    'primary-color': '#39bbdb',
    // 'primary-color': '#94CEDC', 甲方原来颜色
    // 'primary-color': '#4279E4', 蓝色
    // 'primary-color': '#009688', 绿色
    'heading-color': '#191919',
    'text-color': '#404040',
    'text-color-secondary': '#666666'
  },
  //webpack copy favicon 文件，由于document.ejs没有引入，所以不会自动打包输出
  copy: ['/src/assets/favicon.png'],
  proxy: {
    '/api/v1': {
      target: 'http://39.96.191.139:81',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    },
    '/api': {
      target: 'http://39.96.191.139:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  targets: { chrome: 49, firefox: 45, safari: 10, edge: 13, ios: 10 },
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: '../pages/Login/index'
    },
    {
      path: '/project',
      component: '../layouts/PageHeader',
      routes: [
        {
          path: '/project',
          component: '../pages/ProjectList/index'
        },
        {
          path: '/project/:id/sample',
          component: '../pages/SampleList/index'
        },
        {
          path: '/project/:id/sample/:id/crf',
          component: '../pages/CRFdetail/index'
        }
      ]
    },
    {
      path: '/auth',
      component: '../layouts/AuthHeader',
      routes: [
        {
          path: '/auth',
          component: '../pages/Auth/index'
        }
      ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'pet-flask-refactor',
        dll: false,

        routes: {
          exclude: [/models\//, /services\//, /model\.(t|j)sx?$/, /service\.(t|j)sx?$/, /components\//]
        }
      }
    ],
    [
      'babel-plugin-transform-react-remove-prop-types',
      {
        mode: 'wrap',
        ignoreFilenames: ['node_modules']
      }
    ]
  ]
}
