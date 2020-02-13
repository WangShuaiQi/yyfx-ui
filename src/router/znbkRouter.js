export let znbkRouter = [
    {
        path: "/",
        meta: {
            title: '智能布控',
        },
        redirect: '/controlFileList',
        component: () => import('../template/layout/LayoutZnbk'),
        children: [
            {
                path: "controlFileList",
                name: '布控档案列表',
                meta: {
                    title: '布控档案列表',
                    parents:'布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/controlFileList'),
            },
            {
                path: "controlFileApprovalForm",
                name: '发起布控',
                meta: {
                    title: '发起布控',
                    parents:'布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/controlFileApprovalForm')
            },
            {
                path: "controlFileRequisition",
                name: '发起续控',
                meta: {
                    title: '发起续控',
                    parents:'布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/controlFileRequisition')
            },
            {
                path: "cancleControlFile",
                name: '发起撤控',
                meta: {
                    title: '发起撤控',
                    parents:'布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/cancleControlFile')
            },
            {
                path: "addControlFile",
                name: '创建布控档案',
                meta: {
                    title: '创建布控档案',
                    parents:'布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/addControlFile')
            },
            {
                path: "moveControlFile",
                name: '补全多维档案',
                meta: {
                    title: '补全多维档案',
                    parents:'布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/moveControlFile')
            },
            {
                path: "batchCreation",
                name: '批量创建布控档案',
                meta: {
                    title: '批量创建布控档案',
                    parents:'布控档案列表',
                },
                component: () => import('../template/znbk/controlFile/batchCreation')
            },
            {
                path: "viewControlFile/:id",
                name: '查看多维档案',
                meta: {
                    title: '查看多维档案',
                    parents:'布控档案列表',
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
                    parents:'布控档案列表',
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
                    parents:'已发起的布控',
                },
                component: () => import('../template/znbk/controlFile/initiateControlFile'),
                children: []
            },
            {
                path: "approvalControlFile",
                name: '待审批的布控',
                meta: {
                    title: '待审批的布控',
                    parents:'待审批的布控',
                },
                component: () => import('../template/znbk/controlFile/approvalControlFile'),
                children: [
                    {
                        path: "controlFileRequisition",
                        name: '我的布控审批单',
                        meta: {
                            title: '我的布控审批单',
                            parents:'待审批的布控',
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
