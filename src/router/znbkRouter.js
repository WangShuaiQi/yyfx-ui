export let znbkRouter = [
    {
        path: "/",
        meta: {
            title: '智能布控',
        },
        redirect: '/customerManagement',
        component: () => import('../template/layout/LayoutZnbk'),
        children: [
            {
                path: "customerManagement",
                name: '客户管理',
                meta: {
                    title: '客户管理',
                    parents: '客户管理',
                },
                component: () => import('../template/znbk/customerManagement/index'),
            },
            {
                path: "productManagement",
                name: '产品管理',
                meta: {
                    title: '产品管理',
                    parents: '产品管理',
                },
                component: () => import('../template/znbk/productManagement/index'),
            },
            {
                path: "lotNumberManagement",
                name: '批号管理',
                meta: {
                    title: '批号管理',
                    parents: '批号管理',
                },
                component: () => import('../template/znbk/lotNumberManagement/index'),
            },
            {
                path: "InvoiceList",
                name: '出货单列表',
                meta: {
                    title: '出货单列表',
                    parents: '出货单列表',
                },
                component: () => import('../template/znbk/InvoiceList/index'),
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
                component: () => import('../template/znbk/InvoiceList/view'),
            },
            {
                path: "invoiceAdd",
                name: '出货单打印',
                meta: {
                    title: '出货单打印',
                    parents: '出货单列表',
                },
                component: () => import('../template/znbk/InvoiceList/add'),
            },
            {
                path: "controlFileList",
                name: '布控档案列表',
                meta: {
                    title: '布控档案列表',
                    parents: '布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/controlFileList'),
            },
            {
                path: "controlFileApprovalForm",
                name: '发起布控',
                meta: {
                    title: '发起布控',
                    parents: '布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/controlFileApprovalForm')
            },
            {
                path: "controlFileRequisition",
                name: '发起续控',
                meta: {
                    title: '发起续控',
                    parents: '布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/controlFileRequisition')
            },
            {
                path: "cancleControlFile",
                name: '发起撤控',
                meta: {
                    title: '发起撤控',
                    parents: '布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/cancleControlFile')
            },
            {
                path: "addControlFile",
                name: '创建布控档案',
                meta: {
                    title: '创建布控档案',
                    parents: '布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/addControlFile')
            },
            {
                path: "moveControlFile",
                name: '补全多维档案',
                meta: {
                    title: '补全多维档案',
                    parents: '布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/moveControlFile')
            },
            {
                path: "batchCreation",
                name: '批量创建布控档案',
                meta: {
                    title: '批量创建布控档案',
                    parents: '布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/batchCreation')
            },
            {
                path: "viewControlFile/:id",
                name: '查看多维档案',
                meta: {
                    title: '查看多维档案',
                    parents: '布控档案列表',
                },
                params: {
                    id: ""
                },
                component: () => import('../template/znbk/controlFile/viewControlFile')
            },
            {
                path: "editControlFile/:id",
                name: '编辑多维档案',
                meta: {
                    title: '编辑多维档案',
                    parents: '布控档案列表',
                },
                params: {
                    id: ""
                },
                component: () => import('../template/znbk/controlFile/editControlFile')
            },
            {
                path: "initiateControlFile",
                name: '已发起的布控',
                meta: {
                    title: '已发起的布控',
                    parents: '已发起的布控',
                },
                component: () => import('../template/znbk/controlFile/initiateControlFile'),
                children: []
            },
            {
                path: "approvalControlFile",
                name: '待审批的布控',
                meta: {
                    title: '待审批的布控',
                    parents: '待审批的布控',
                },
                component: () => import('../template/znbk/controlFile/approvalControlFile'),
                children: [
                    {
                        path: "controlFileRequisition",
                        name: '我的布控审批单',
                        meta: {
                            title: '我的布控审批单',
                            parents: '待审批的布控',
                        },
                        component: () => import('../template/znbk/controlFile/controlFileRequisition')
                    }
                ]
            }
        ]
    },
    {
        path: '/404',
        meta: {
            title: '404',
        },
        component: () => import('../template/404')
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]
