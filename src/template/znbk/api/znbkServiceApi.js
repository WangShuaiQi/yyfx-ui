/****
 * 项目专项API接口封装
 */
import axios from 'axios'

/**
 * 客户列表
 * @param 
 * @returns {Promise}
 */
export let customerList = (metadata) => {
        return new Promise((r, j) => {
            axios.get("/apis/v1/customer/list", { params: metadata }).then(d => {
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
            axios.post("/apis/v1/customer/create", formObj).then(d => {
                r(d.data);
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
        axios.get("/apis/v1/customer/delete", { params: formObj }).then(d => {
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
        axios.get("/apis/v1/product/list", { params: metadata }).then(d => {
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
        axios.post("/apis/v1/product/create", formObj).then(d => {
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
        axios.post("/apis/v1/product/edit", formObj).then(d => {
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
        axios.get("/apis/v1/product/delete", { params: formObj }).then(d => {
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
        axios.get("/apis/v1/batchnumber/list", { params: metadata }).then(d => {
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
        axios.post("/apis/v1/batchnumber/create", formObj).then(d => {
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
        axios.post("/apis/v1/batchnumber/edit", formObj).then(d => {
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
        axios.get("/apis/v1/batchnumber/delete", { params: formObj }).then(d => {
            r(d.status);
        });
    })
}

/**
 * 出货单列表
 * @param 
 * @returns {Promise}
 */
export let invoiceList = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/form/search", { params: metadata }).then(d => {
            r(d.data);
        });
    })
}

/**
 * 创建出货单
 * @param 
 * @returns {Promise}
 */
export let invoiceCreate = (formObj) => {
        return new Promise((r, j) => {
            axios.post("/apis/v1/form/create", formObj).then(d => {
                r(d.status);
            });
        })
    }
    /**
     * 获取产品规格详情
     * @param 
     * @returns {Promise}
     */
export let productGg = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/product/list/full", { params: metadata }).then(d => {
            r(d.data.list);
        });
    })
}

/**
 * 获取产品批号详情
 * @param 
 * @returns {Promise}
 */
export let productPh = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/batchnumber/list/full", { params: metadata }).then(d => {
            r(d.data.list);
        });
    })
}

/**
 * 获取产品批号详情
 * @param 
 * @returns {Promise}
 */
export let getStorageCondition = () => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/product/store-condition").then(d => {
            r(d.data);
        });
    })
}

/**
 * 获取最近的价格
 * @param 
 * @returns {Promise}
 */
export let getLastPrice = (metadata) => {
    return new Promise((r, j) => {
        axios.get("/apis/v1/form/last-price", { params: metadata }).then(d => {
            r(d.data);
        });
    })
}


/**
 * 出货单删除
 * @param 
 * @returns {Promise}
 */
export let invoiceDelete = (id) => {
    return new Promise((r, j) => {
        axios.get(`/apis/v1/form/delete/${id}`).then(d => {
            r(d.status);
        });
    })
}

/**
 * 出货单详情
 * @param 
 * @returns {Promise}
 */
export let invoiceView = (id) => {
    return new Promise((r, j) => {
        axios.get(`/apis/v1/form/detail/${id}`).then(d => {
            r(d.data);
        });
    })
}

/**
 * 获取出货单编号
 * @param 
 * @returns {Promise}
 */
export let invoiceCode = () => {
        return new Promise((r, j) => {
            axios.get(`/apis/v1/form/form-code`).then(d => {
                r(d.data);
            });
        })
    }
    /**
     * 获取出货单编号
     * @param 
     * @returns {Promise}
     */
export let warehouse = () => {
        return new Promise((r, j) => {
            axios.get(`/apis/v1/product/ware-house`).then(d => {
                r(d.data);
            });
        })
    }
    /**
     * 获取用户
     * @param 
     * @returns {Promise}
     */
export let getuser = () => {
        return new Promise((r, j) => {
            axios.get(`/apis/v1/auther`).then(d => {
                r(d.data);
            });
        })
    }
    /**
     * 获取用户
     * @param 
     * @returns {Promise}
     */
export let getFormMaker = () => {
    return new Promise((r, j) => {
        axios.get(`/apis/v1/form/form-maker`).then(d => {
            r(d.data);
        });
    })
}