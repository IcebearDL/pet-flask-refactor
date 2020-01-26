
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
      component: '../layouts/index',
      routes: [
        {
          path: '/project',
          component: '../pages/ProjectList/index',
          routes: [
            {
              path: '/project/sample',
              component: '../pages/SampleList/index'
            }
          ]
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
