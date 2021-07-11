<template>
    <div>
        <el-header>
            <el-page-header content="出货单打印" @back="goBack"></el-page-header>
        </el-header>
        <el-row class="template" id="templates">
            <el-col :span="24">
                <el-row>
                    <el-col :span="24" class="centerText" style="font-size: 20px;">成都赞美生物科技有限公司随货同行单</el-col>
                </el-row>
                <el-form :inline="true" size="mini">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="购货单位">
                                <!-- <el-input v-model="formObj.purchasingUnit "></el-input> -->
                                <el-select value-key="name" v-model="formObj.purchasingUnit" placeholder="请回车搜索" size="mini" filterable @change="purchasingUnitChange">
                                    <el-option v-for="item in select.customerList" :key="item.id" :label="item.name" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="收货地址">
                                <el-input v-model="formObj.recvAdress"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="出库时间">
                                <el-date-picker type="date" placeholder="选择日期" v-model="formObj.outStoreTimeL" value-format="timestamp" disabled></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系电话">
                                <el-input v-model="formObj.purchasingUnitTel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="储运条件">
                                <el-select v-model="formObj.storageCondition" placeholder="请选择活动区域">
                                    <el-option v-for="(item,index) in  select.storageCondition" :key="index" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-table :data="tableList" size="mini" border>
                                <el-table-column label="商品名称" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.productName" placeholder="请回车搜索" size="mini" filterable @change="getProductSpecification(scope.row,scope.$index)">
                                            <el-option v-for="item in select.productName" :key="item.id" :label="item.productName" :value="item.productName"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="规格" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.productSpecification" placeholder="请选择" size="mini" @change="getProductSpecificationChange(scope.row,scope.$index)">
                                            <el-option v-for="item in  select.productSpecificationArr[scope.$index].productSpecification" :key="item.id" :label="item.standard " :value="item.standard "></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位" :show-overflow-tooltip="true" prop="unit"></el-table-column>
                                <el-table-column label="生产许可证号" :show-overflow-tooltip="true" prop="producingArea"></el-table-column>
                                <el-table-column label="注册证号" :show-overflow-tooltip="true" prop="reginLicence"></el-table-column>
                                <el-table-column label="生产厂商" :show-overflow-tooltip="true" prop="manufacturer"></el-table-column>
                                <el-table-column label="生产批号" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.batchNumber" value-key="batchId" placeholder="请选择" size="mini" @change="batchNumberChange(scope.row,scope.$index)">
                                            <el-option v-for="item in select.batchNumberArr[scope.$index].batchNumber" :key="item.id " :label="item.batchId" :value="item "></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="生产日期" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">{{scope.row.produceTimeL |formatTime}}</template>
                                </el-table-column>
                                <el-table-column label="有效期至" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">{{scope.row.validityTimeL |formatTime}}</template>
                                </el-table-column>
                                <el-table-column label="数量" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.saleNumber" type="number" size="mini" @change="getAmountMoneyMount(scope.row,scope.$index)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单价" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.unitPrice" type="number" size="mini" @change="getAmountMoneyMount(scope.row,scope.$index)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="金额" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">{{scope.row.amountMoneyMount}}</template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="合计金额">
                                <el-input v-model="formObj.moneyReceived" type="number" @change="formObj.moneyReceived=getFloatStr(formObj.moneyReceived)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :offset="6">
                            <el-form-item label="合计金额大写">
                                <el-input v-model="formObj.sumRecevied"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <span class="key">第一联:</span>
                            <span>财务记帐(白)</span>
                        </el-col>
                        <el-col :span="6">
                            <span class="key">第二联:</span>
                            <span>结算（粉）</span>
                        </el-col>
                        <el-col :span="6">
                            <span class="key">第三联:</span>
                            <span>客户（蓝）</span>
                        </el-col>
                        <el-col :span="6">
                            <span class="key">第四联:</span>
                            <span>存根（黄）</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="制单">
                                <el-select value-key="name" v-model="formObj.formCreator" placeholder="请回车搜索" size="mini" filterable>
                                    <el-option v-for="(item,index) in select.formMaker" :key="index" :label="item" :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="出库复核">
                                <el-input v-model="formObj.outEntrepotCheck"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="发货人">
                                <el-input v-model="formObj.shipper"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="收货人">
                                <el-input v-model="formObj.consignee"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="地址">
                                <el-input v-model="formObj.saleUnitAdress"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        <div class="centerText">
            <el-button @click="printdata" size="mini" type="primary">打印票据</el-button>
        </div>
        <!--startprint1-->
        <printVue :formObj="formObj" :tableList="tableList" ref="printVue"></printVue>
        <!--endprint1-->
    </div>
</template>
<script>
import moment from "moment";
import {
    productList,
    invoiceCode,
    invoiceCreate,
    productGg,
    productPh,
    getStorageCondition,
    warehouse,
    getuser,
    customerList,
    getFormMaker,
    getLastPrice,
} from "../../znbk/api/znbkServiceApi";
import printVue from "./print.vue";

export default {
    components: { printVue },
    data() {
        return {
            formObj: {
                purchasingUnit: "",
                recvAdress: "",
                // outStoreTimeL: new Date().getTime(),
                outStoreTimeL: 1625932800000,
                formId: "",
                purchasingUnitTel: "",
                storageCondition: "阴凉",
                moneyReceived: "",
                sumRecevied: "",
                formCreator: "",
                outEntrepotCheck: "",
                shipper: "",
                saleUnitAdress: "",
            },
            tableList: [
                {
                    productName: "",
                    productSpecification: "",
                    unit: "",
                    producingArea: "",
                    reginLicence: "",
                    manufacturer: "",
                    batchNumber: "",
                    produceTimeL: "",
                    validityTimeL: "",
                    saleNumber: 0,
                    unitPrice: 0.0,
                    amountMoneyMount: 0.0,
                },
                {
                    productName: "",
                    productSpecification: "",
                    unit: "",
                    producingArea: "",
                    reginLicence: "",
                    manufacturer: "",
                    batchNumber: "",
                    produceTimeL: "",
                    validityTimeL: "",
                    saleNumber: 0,
                    unitPrice: 0.0,
                    amountMoneyMount: 0.0,
                },
                {
                    productName: "",
                    productSpecification: "",
                    unit: "",
                    producingArea: "",
                    reginLicence: "",
                    manufacturer: "",
                    batchNumber: "",
                    produceTimeL: "",
                    validityTimeL: "",
                    saleNumber: 0,
                    unitPrice: 0.0,
                    amountMoneyMount: 0.0,
                },
            ],
            select: {
                productName: [],
                storageCondition: [],
                customerList: [],
                formMaker: [],
                productSpecificationArr: [
                    {
                        productSpecification: [],
                    },
                    {
                        productSpecification: [],
                    },
                    {
                        productSpecification: [],
                    },
                ],
                batchNumberArr: [
                    { batchNumber: [] },
                    { batchNumber: [] },
                    { batchNumber: [] },
                ],
            },
        };
    },
    mounted() {
        this.getList(1);
        this.getStorageCondition();
        this.warehouse();
        this.getuser();
        this.getcontrol();
        this.getFormMaker();
    },
    watch: {
        tableList() {
            console.log(this.tableList);
        },
    },
    methods: {
        // 获取登录用户
        async getuser() {
            let user = await getuser();
            this.formObj.shipper = user.userName;
        },
        // 获取客户
        async getcontrol() {
            let metadata = {};
            metadata.page = 1;
            metadata.pageSize = 100000;

            let tableList = await customerList(metadata);
            this.select.customerList = tableList.list;
        },
        purchasingUnitChange(value) {
            this.formObj.purchasingUnit = value.name;
            this.formObj.recvAdress = value.address;
            this.formObj.purchasingUnitTel = value.tel;
        },
        async getFormMaker() {
            this.select.formMaker = await getFormMaker();
            this.formObj.formCreator = this.select.formMaker[0];
        },
        // 获取公司地址
        async warehouse() {
            let warehousearr = await warehouse();
            this.formObj.saleUnitAdress = warehousearr[0].warehouseAdress;
            // this.getuser();
        },
        // 获取产品列表
        async getList() {
            let metadata = {};
            metadata.page = 1;
            metadata.pageSize = 100000;
            metadata.productName = "";
            metadata.manufacturer = "";

            let tableList = await productList(metadata);
            this.select.productName = tableList.list;
        },
        // 获取储运条件
        async getStorageCondition() {
            this.select.storageCondition = await getStorageCondition();
        },
        // 获取规格
        async getProductSpecification(row, index) {
            let obj = {};
            obj.productName = row.productName;

            this.select.productSpecificationArr[index].productSpecification =
                await productGg(obj);

            row.productSpecification =
                this.select.productSpecificationArr[
                    index
                ].productSpecification[0].standard;

            row.producingArea =
                this.select.productSpecificationArr[
                    index
                ].productSpecification[0].produceLicence;

            row.unit =
                this.select.productSpecificationArr[
                    index
                ].productSpecification[0].unit;

            row.reginLicence =
                this.select.productSpecificationArr[
                    index
                ].productSpecification[0].reginLicence;

            row.manufacturer =
                this.select.productSpecificationArr[
                    index
                ].productSpecification[0].manufacturer;

            row.manufacturer =
                this.select.productSpecificationArr[
                    index
                ].productSpecification[0].manufacturer;
            this.getProductSpecificationChange(row, index);
        },
        // 获取编号
        async getProductSpecificationChange(row, index) {
            let obj = {};
            obj.productName = row.productName;
            obj.productStandard = row.productSpecification;

            this.select.batchNumberArr[index].batchNumber = await productPh(
                obj
            );
            if (this.formObj.purchasingUnit == "") {
                this.$message.warning("请选择购货单位并重新选择商品以获取单价");
            } else {
                let lastPriceObj = {
                    productName: row.productName,
                    standard: row.productSpecification,
                    customerName: this.formObj.purchasingUnit,
                };

                let unitPrice = await getLastPrice(lastPriceObj);
                if (typeof unitPrice != "object") {
                    row.unitPrice = unitPrice;
                } else {
                    row.unitPrice = 0.0;
                }
            }
        },
        // 获取其他数据
        batchNumberChange(row, index) {
            let batchNumber = JSON.parse(JSON.stringify(row.batchNumber));
            row.produceTimeL = batchNumber.produceTimeL;
            row.validityTimeL = batchNumber.validityTimeL;
            row.saleNumber = batchNumber.productCount || 0;
            row.batchNumber = batchNumber.batchId;
        },
        // 合计
        getAmountMoneyMount(row, index) {
            row.amountMoneyMount = row.saleNumber * row.unitPrice;
            row.unitPrice = this.getFloatStr(row.unitPrice);
            row.amountMoneyMount = this.getFloatStr(row.amountMoneyMount);
            this.formObj.moneyReceived =
                Number(this.tableList[0].amountMoneyMount) +
                Number(this.tableList[1].amountMoneyMount) +
                Number(this.tableList[2].amountMoneyMount);
            this.formObj.moneyReceived = this.getFloatStr(
                this.formObj.moneyReceived
            );
            this.formObj.sumRecevied = this.changeMoneyToChinese(
                Number(this.formObj.moneyReceived)
            );
        },
        getFloatStr(num) {
            num += "";
            num = num.replace(/[^0-9|\.]/g, "");
            if (/^0+/) num = num.replace(/^0+/, "");
            if (!/\./.test(num)) num += ".00";
            if (/^\./.test(num)) num = "0" + num;
            num += "00";
            num = num.match(/\d+\.\d{2}/)[0];
            return num;
        },
        changeMoneyToChinese(money) {
            var cnNums = new Array(
                "零",
                "壹",
                "贰",
                "叁",
                "肆",
                "伍",
                "陆",
                "柒",
                "捌",
                "玖"
            ); //汉字的数字
            var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
            var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
            var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
            //var cnInteger = "整"; //整数金额时后面跟的字符
            var cnIntLast = "元"; //整型完以后的单位
            var maxNum = 999999999999999.9999; //最大处理的数字

            var IntegerNum; //金额整数部分
            var DecimalNum; //金额小数部分
            var ChineseStr = ""; //输出的中文金额字符串
            var parts; //分离金额后用的数组，预定义
            if (money == "") {
                return "";
            }
            money = parseFloat(money);
            if (money >= maxNum) {
                $.alert("超出最大处理数字");
                return "";
            }
            if (money == 0) {
                //ChineseStr = cnNums[0]+cnIntLast+cnInteger;
                ChineseStr = cnNums[0] + cnIntLast;
                //document.getElementById("show").value=ChineseStr;
                return ChineseStr;
            }
            money = money.toString(); //转换为字符串
            if (money.indexOf(".") == -1) {
                IntegerNum = money;
                DecimalNum = "";
            } else {
                parts = money.split(".");
                IntegerNum = parts[0];
                DecimalNum = parts[1].substr(0, 4);
            }
            if (parseInt(IntegerNum, 10) > 0) {
                //获取整型部分转换
                let zeroCount = 0;
                let IntLen = IntegerNum.length;
                for (let i = 0; i < IntLen; i++) {
                    let n = IntegerNum.substr(i, 1);
                    let p = IntLen - i - 1;
                    let q = p / 4;
                    let m = p % 4;
                    if (n == "0") {
                        zeroCount++;
                    } else {
                        if (zeroCount > 0) {
                            ChineseStr += cnNums[0];
                        }
                        zeroCount = 0; //归零
                        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                    }
                    if (m == 0 && zeroCount < 4) {
                        ChineseStr += cnIntUnits[q];
                    }
                }
                ChineseStr += cnIntLast;
                //整型部分处理完毕
            }
            if (DecimalNum != "") {
                //小数部分
                let decLen = DecimalNum.length;
                for (let i = 0; i < decLen; i++) {
                    let n = DecimalNum.substr(i, 1);
                    if (n != "0") {
                        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
                    }
                }
            }
            if (ChineseStr == "") {
                ChineseStr += cnNums[0] + cnIntLast;
            }
            return ChineseStr;
        },
        // 返回
        goBack() {
            this.$router.push({
                name: "出货单列表",
            });
        },
        // 打印新增
        printdata() {
            invoiceCode().then((res) => {
                this.formObj.formId = res;
                let obj = JSON.parse(JSON.stringify(this.formObj));
                obj.productDetail = JSON.parse(JSON.stringify(this.tableList));
                invoiceCreate(obj).then((res) => {
                    if (res == 200) {
                        this.$refs.printVue.printHtml();
                    } else {
                        this.$message.error("提交失败");
                    }
                });
            });
        },
    },
    filters: {
        getSelectOption(v, selectOption, type, values) {
            let value = "";
            selectOption.map((item) => {
                if (v == item[type]) {
                    value = item[values];
                }
            });
            return value;
        },
        formatTime(v) {
            if (v) {
                let time = "";
                time = moment(v).format("YYYY-MM-DD");
                return time;
            } else {
                return "";
            }
        },
        formatTime1(v) {
            if (v) {
                let time = "";
                time = moment(v).format("YYYYMMDD");
                return time;
            } else {
                return "";
            }
        },
    },
};
var afterPrint = function () {};
window.onafterprint = afterPrint;
</script>
<style>
@import "bootstrap/dist/css/bootstrap.min.css";
</style>
<style lang="scss" scoped>
.centerText {
    text-align: center;
}
.key {
    display: inline-block;
    min-width: 60px;
    // font-size: 20px;
}
.key + span {
    // font-size: 20px;
}
.template {
    .el-row {
        margin-top: 10px;
    }
}
#InvoiceView {
    height: 100%;
    .el-header {
        // height: 100px !important;
        .el-page-header {
            margin-bottom: 15px;
        }
    }
}
#template {
    // width: 21.7cm;
    width: 100%;
    // height: 9.2cm;
    display: none;
    .el-row {
        margin-top: 5px;
    }
    .key {
        display: inline-block;
        min-width: 60px;
        font-size: 18px;
    }
    .key + span {
        font-size: 18px;
    }
    .table-bordered > tbody > tr > td,
    .table-bordered > tbody > tr > th,
    .table-bordered > tfoot > tr > td,
    .table-bordered > tfoot > tr > th,
    .table-bordered > thead > tr > td,
    .table-bordered > thead > tr > th {
        border: 3px solid #000;
        text-align: left;
        padding: 0px;
    }
    .table th div {
        display: inline-block;
        width: 125%;
        height: 100%;
        // -webkit-transform: scale(0.6) translateX(-35%);
        // transform: scale(0.8) translateX(-13%);
        text-align: center;
    }
    .table td div {
        display: inline-block;
        width: 125%;
        height: 100%;
        // -webkit-transform: scale(0.6) translateX(-35%);
        // transform: scale(0.8) translateX(-13%);
    }
}
</style>
<style lang="scss">
#InvoiceView {
    .el-dialog__header {
        background: #409eff;
        .el-dialog__title {
            color: #fff;
        }
        .el-dialog__close {
            color: #fff !important;
        }
    }
}
.myTable {
    width: 100%;
    th {
        border: 1px solid #000;
        border-collapse: collapse;
        div {
            display: inline-block;
            width: 100%;
            height: 100%;
            // -webkit-transform: scale(0.6) translateX(-35%);
            // transform: scale(0.8) translateX(-13%);
            text-align: center;
            padding: 5px 0;
        }
    }
    td {
        border: 1px solid #000;
        border-collapse: collapse;
        div {
            display: inline-block;
            width: 100%;
            height: 100%;
            text-align: center;
            // -webkit-transform: scale(0.6) translateX(-35%);
            // transform: scale(0.8) translateX(-13%);
            padding: 5px 0;
        }
    }
}
</style>


