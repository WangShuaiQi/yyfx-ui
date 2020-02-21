/****
 * 项目专项API接口封装
 */
import axios from 'axios'

/**
 * 获取部门下拉树
 * @param 
 * @returns {Promise}
 */
export let getDept = () => {
    return new Promise((r, j) => {
        axios.get("/upms/departments/tree").then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 获取布控状态
 * @param 
 * @returns {Promise}
 */
export let getZnbkStatus = () => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/bkdas/status-enums").then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 获取布控档案列表
 * @param 
 * @returns {Promise}
 */
export let getZnbkList = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/bkdas", { params: metadata }).then(d => {
            r(d);
        });
    })
}
/**
 * 获取布控中数量
 * @param 
 * @returns {Promise}
 */
export let getBkCount = (status) => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/bkdas/count", { params: { status: status } }).then(d => {
            r(d.data.data);
        });
    })
}

/**
 * 删除布控档案
 * @param 
 * @returns {Promise}
 */
export let delControlFile = (ids) => {
    return new Promise((r, j) => {
        axios.post(`/ga-znbk-api/apis/v1/bkdas/${ids}/delete`).then(d => {
            r(d.data.status);
        });
    })
}
/**
 * 添加布控
 * @param 
 * @returns {Promise}
 */
export let addControlFile = (formObj) => {
    return new Promise((r, j) => {
        axios.post("/ga-znbk-api/apis/v1/bkdas", formObj).then(d => {
            r(d.data.status);
        });
    })
}
/**
 * 编辑布控
 * @param 
 * @returns {Promise}
 */
export let editControlFile = (formObj, id) => {
    return new Promise((r, j) => {
        axios.post(`/ga-znbk-api/apis/v1/bkdas/${id}/update`, formObj).then(d => {
            r(d.data.status);
        });
    })
}
/**
 * 获取多维档案
 * @param 
 * @returns {Promise}
 */
export let getmoveControlFile = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/bkdas/completing-multi", { params: metadata }).then(d => {
            r(d.data.data);
        });
    })
}

/**
 * 获取布控详情
 * @param 
 * @returns {Promise}
 */
export let getBasicInfo = (id) => {
    return new Promise((r, j) => {
        axios.get(`/ga-znbk-api/apis/v1/bkdas/${id}/detail/basic-info`).then(d => {
            r(d.data.data);
        });
    })
}

// /**
//  * 获取布控布撤控审批详情
//  * @param 
//  * @returns {Promise}
//  */
// export let getBasicBcks = (id) => {
//     return new Promise((r, j) => {
//         axios.get(`/ga-znbk-api/apis/v1/bkdas/${id}/detail/bck-info`).then(d => {
//             r(d.data.data);
//         });
//     })
// }
/**
 * 获取布控布撤控审批详情
 * @param 
 * @returns {Promise}
 */
export let getBasicBcks = (id) => {
    return new Promise((r, j) => {
        axios.get(`/ga-znbk-api/apis/v1/common/da/${id}/approve-history`).then(d => {
            r(d.data);
        });
    })
}
/**
 * 获取布控布撤控审批详情
 * @param 
 * @returns {Promise}
 */
export let getWarnning = (id,metadata) => {
    return new Promise((r, j) => {
        axios.get(`/ga-znbk-api/apis/v1/bkdas/${id}/detail/warnning`, { params: metadata }).then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 提交布控申请单
 * @param 
 * @returns {Promise}
 */
export let addApprovalForm = (formObj) => {
    return new Promise((r, j) => {
        axios.post(`/ga-znbk-api/apis/v1/bkc-approvals/bk`, formObj).then(d => {
            r(d.data.status);
        });
    })
}
/**
 * 提交撤控申请单
 * @param 
 * @returns {Promise}
 */
export let addApprovalFormCk = (formObj) => {
    return new Promise((r, j) => {
        axios.post(`/ga-znbk-api/apis/v1/bkc-approvals/ck`, formObj).then(d => {
            r(d.data.status);
        });
    })
}
/**
 * 获取布控档案列表
 * @param 
 * @returns {Promise}
 */
export let getInitiatingList = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/bkc-approvals/apply-list", { params: metadata }).then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 获取布控档案列数量
 * @param 
 * @returns {Promise}
 */
export let getInitiatingCount = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/bkc-approvals/apply-list/bkda/count", { params: metadata }).then(d => {
            r(d.data.data);
        });
    })
}

/**
 * 获取待审批档案列表
 * @param 
 * @returns {Promise}
 */
export let getPendingList = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/bkc-approvals/approval-list", { params: metadata }).then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 获取待审批档案列表数量
 * @param 
 * @returns {Promise}
 */
export let getPendingCount = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/bkc-approvals/approval-list/bkda/count", { params: metadata }).then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 获取申请人下拉
 * @param 
 * @returns {Promise}
 */
export let getUserList = () => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/bkc-approvals/applicants").then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 审批操作布控
 * @param 
 * @returns {Promise}
 */
export let submitApplicationBk = (taskId, formObj) => {
    return new Promise((r, j) => {
        axios.post(`/ga-znbk-api/apis/v1/bk/process-tasks/${taskId}/complete`, formObj).then(d => {
            r(d.data.status);
        });
    })
}
/**
 * 审批操作撤控
 * @param 
 * @returns {Promise}
 */
export let submitApplicationCk = (bkdaIds, formObj) => {
    return new Promise((r, j) => {
        axios.post(`/ga-znbk-api/apis/v1/ck/process-tasks/${bkdaIds}/complete`, formObj).then(d => {
            r(d.data.status);
        });
    })
}

/**
 * 获取申请人下拉
 * @param 
 * @returns {Promise}
 */
export let getProcessImg = (processId) => {
    return new Promise((r, j) => {
        axios.get(`/ga-znbk-api/apis/v1/processes/${processId}/fetchImg`).then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 搜索布控人员
 * @param 
 * @returns {Promise}
 */
export let searchPerson = (formObj) => {
    return new Promise((r, j) => {
        axios.get(`/ga-znbk-api/apis/v1/bkdas/bkdxes`, { params: formObj }).then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 查询字典
 * @param 
 * @returns {Promise}
 */
export let getDictsValues = (url, op) => {
    return new Promise((r, j) => {
        axios.get(`/ww-wwjc-api/apis/v1/dicts/${url}`, { params: { metadata: op } }).then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 批量获取布控档案
 * @param 
 * @returns {Promise}
 */
export let batchGetControlFile = (formObj) => {
    return new Promise((r, j) => {
        axios.post(`/ga-znbk-api/apis/v1/bkdas/detail/bkda`, formObj).then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 文件信息
 * @param 
 * @returns {Promise}
 */
export let getFileInfo = (fileId) => {
    return new Promise((r, j) => {
        axios.get(`/ga-infrastructure-api/ga-infrastructure-api/api/v1/files/${fileId}`).then(d => {
            r(d.data.data.fileName);
        });
    })
}

/**
 * 批量获取布控档案
 * @param 
 * @returns {Promise}
 */
export let getBatches = () => {
    return new Promise((r, j) => {
        axios.get(`/ga-znbk-api/apis/v1/bkc-approvals/batches`).then(d => {
            r(d.data.data);
        });
    })
}
/**
 * 头像照片
 * @param 
 * @returns {Promise}
 */
export let getPersonImg = (gmsfhm) => {
    let user = JSON.parse(sessionStorage.getItem("user") || "{}");
    let op = {}
    op.requestUserName = user.name
    op.requestUserSfzh = user.idcardno
    op.requestUserOrgid = user.orgid
    return `/ga-infrastructure-api/ga-infrastructure-api/apis/v1/person-img/${gmsfhm}?requestUserName=${user.name}&requestUserSfzh=${user.idcardno}&requestUserOrgid=${user.orgid}`
}

/**
 * 添加续控申请单
 * @param 
 * @returns {Promise}
 */
export let addControlFileForm = (formObj) => {
    return new Promise((r, j) => {
        axios.post("/ga-znbk-api/apis/v1/xk-approvals/xk", formObj).then(d => {
            r(d.data.status);
        });
    })
} 

/**
 * 审批操作布控
 * @param 
 * @returns {Promise}
 */
export let submitApplicationXk = (taskId, formObj) => {
    return new Promise((r, j) => {
        axios.post(`/ga-znbk-api/apis/v1/xk-approvals/${taskId}/complete`, formObj).then(d => {
            r(d.data.status);
        });
    })
}
/**
 * 模糊搜索民警
 * @param 
 * @returns {Promise}
 */
export function getPolice(params) {
    return new Promise((r, j)=>{
        axios.get('/upms/users',{params:params}).then((res)=>{
            r(res.data.data);
        }).catch(()=>{
            j('获取数据出错')
        })
    })
}
/**
 * 获取预警民警
 * @param 
 * @returns {Promise}
 */
export let getYjPerson = (formObj) => {
    return new Promise((r, j) => {
        axios.post(`/ga-znbk-api/apis/v1/bkc-approvals/warm-recipient`, formObj).then(d => {
            r(d.data.data);
        });
    })
}

/**
 * 获取当前登录人是否州局
 * @param 
 * @returns {Promise}
 */
export let getIsZhouju = () => {
    return new Promise((r, j) => {
        axios.get("/ga-znbk-api/apis/v1/upms/zhouju/judge").then(d => {
            r(d.data.data);
        });
    })
}


/**
 * 客户列表
 * @param 
 * @returns {Promise}
 */
export let customerList = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/customer/list",{ params: metadata }).then(d => {
            console.log(d.data)
            r(d.data);
        });
    })
}
/**
 * 新增编辑客户信息
 * @param 
 * @returns {Promise}
 */
export let customerCreate = (formObj) => {
    return new Promise((r, j) => {
        axios.post("/apis/v1/customer/create",formObj).then(d => {
            r(d.status);
        });
    })
}
/**
 * 删除客户信息
 * @param 
 * @returns {Promise}
 */
export let customerDelete = (formObj) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/customer/delete",{ params: formObj }).then(d => {
            console.log(d)
            r(d.status);
        });
    })
}

/**
 * 产品列表
 * @param 
 * @returns {Promise}
 */
export let productList = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/product/list",{ params: metadata }).then(d => {
            r(d.data);
        });
    })
}

/**
 * 新增产品信息
 * @param 
 * @returns {Promise}
 */
export let productCreate = (formObj) => {
    return new Promise((r, j) => {
        axios.post("/apis/v1/product/create",formObj).then(d => {
            r(d.status);
        });
    })
}

/**
 * 编辑产品信息
 * @param 
 * @returns {Promise}
 */
export let productEdit = (formObj) => {
    return new Promise((r, j) => {
        axios.post("/apis/v1/product/edit",formObj).then(d => {
            r(d.status);
        });
    })
}

/**
 * 删除产品信息
 * @param 
 * @returns {Promise}
 */
export let productDelete = (formObj) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/product/delete",{ params: formObj }).then(d => {
            r(d.status);
        });
    })
}

/**
 * 批号列表
 * @param 
 * @returns {Promise}
 */
export let batchnumberList = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/batchnumber/list",{ params: metadata }).then(d => {
            r(d.data);
        });
    })
}

/**
 * 新增批号信息
 * @param 
 * @returns {Promise}
 */
export let batchnumberCreate = (formObj) => {
    return new Promise((r, j) => {
        axios.post("/apis/v1/batchnumber/create",formObj).then(d => {
            r(d.status);
        });
    })
}

/**
 * 编辑批号信息
 * @param 
 * @returns {Promise}
 */
export let batchnumberEdit = (formObj) => {
    return new Promise((r, j) => {
        axios.post("/apis/v1/batchnumber/edit",formObj).then(d => {
            r(d.status);
        });
    })
}

/**
 * 删除批号信息
 * @param 
 * @returns {Promise}
 */
export let batchnumberDelete = (formObj) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/batchnumber/delete",{ params: formObj }).then(d => {
            r(d.status);
        });
    })
}






 





















