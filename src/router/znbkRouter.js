export let znbkRouter = [{
        path: "/",
        meta: {
            title: '医药分析',
        },
        redirect: '/customerManagement',
        component: () =>
            import ('../template/layout/LayoutZnbk'),
        children: [{
                path: "customerManagement",
                name: '客户管理',
                meta: {
                    title: '客户管理',
                    parents: '客户管理',
                },
                component: () =>
                    import ('../template/znbk/customerManagement/index'),
            },
            {
                path: "productManagement",
                name: '产品管理',
                meta: {
                    title: '产品管理',
                    parents: '产品管理',
                },
                component: () =>
                    import ('../template/znbk/productManagement/index'),
            },
            {
                path: "lotNumberManagement",
                name: '批号管理',
                meta: {
                    title: '批号管理',
                    parents: '批号管理',
                },
                component: () =>
                    import ('../template/znbk/lotNumberManagement/index'),
            },
            {
                path: "InvoiceList",
                name: '出货单列表',
                meta: {
                    title: '出货单列表',
                    parents: '出货单列表',
                },
                component: () =>
                    import ('../template/znbk/InvoiceList/index'),
            },
            {
                path: "InvoiceView/:id",
                name: '出货单详情',
                meta: {
                    title: '出货单详情',
                    parents: '出货单列表',
                },
                params: {
                    id: ""
                },
                component: () =>
                    import ('../template/znbk/InvoiceList/view'),
            },
            {
                path: "invoiceAdd",
                name: '出货单打印',
                meta: {
                    title: '出货单打印',
                    parents: '出货单列表',
                },
                component: () =>
                    import ('../template/znbk/InvoiceList/add'),
            },
        ]
    },
    {
        path: '/404',
        meta: {
            title: '404',
        },
        component: () =>
            import ('../template/404')
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]