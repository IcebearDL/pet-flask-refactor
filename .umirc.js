
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  theme: {
    "primary-color": "#1DA57A",
  },
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
      path: '/',
      component: '../layouts/PageHeader',
      routes: [
        {
          path: '/project',
          component: '../pages/ProjectList/index',
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
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'pet-flask-refactor',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}
