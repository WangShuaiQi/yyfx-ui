<template>
    <div>
        <!--startprint1-->
        <el-row class="template" id="template">
            <el-col :span="24">
                <el-row>
                    <el-col :span="24" class="centerText" style="font-size: 34px; display: block; margin-bottom: 20px">成都赞美生物科技有限公司随货同行单</el-col>
                </el-row>
                <el-row style=" margin-top: 5px;">
                    <el-col :span="13">
                        <span class="key">购货单位:</span>
                        <span>{{formObj.purchasingUnit}}</span>
                    </el-col>
                    <el-col :span="11">
                        <span class="key">收货地址:</span>
                        <span>{{formObj.recvAdress}}</span>
                    </el-col>
                </el-row>
                <el-row style=" margin-top: 5px;">
                    <el-col :span="6">
                        <span class="key">出库时间:</span>
                        <span>{{formObj.outStoreTimeL |formatTime}}</span>
                    </el-col>
                    <el-col :span="7">
                        <span class="key">单据编号:</span>
                        <span>{{formObj.formId }}</span>
                    </el-col>
                    <el-col :span="5">
                        <span class="key">联系电话:</span>
                        <span>{{formObj.purchasingUnitTel}}</span>
                    </el-col>
                    <el-col :span="4">
                        <span class="key">储运条件:</span>
                        <span>{{formObj.storageCondition}}</span>
                    </el-col>
                </el-row>
                <el-row style=" margin-top: 5px;">
                    <el-col :span="24">
                        <table class="myTable" style="font-size: 16px;" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th>
                                        <div style="padding: 5px 0;">商品名称</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">规格</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">单位</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">生产许可证号</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">注册证号</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">生产厂商</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">生产批号</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">生产日期</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">有效期至</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">数量</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">单价</div>
                                    </th>
                                    <th>
                                        <div style="padding: 5px 0;">金额</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in  tableList" :key="index">
                                    <td>
                                        <div style="padding: 5px 0;">{{item.productName}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.productSpecification}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.unit}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.producingArea}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.reginLicence}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.manufacturer}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.batchNumber}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.produceTimeL |formatTime1}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.validityTimeL |formatTime1}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.saleNumber}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.unitPrice}}</div>
                                    </td>
                                    <td>
                                        <div style="padding: 5px 0;">{{item.amountMoneyMount}}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </el-col>
                </el-row>
                <el-row style=" margin-top: 5px;">
                    <el-col :span="12">
                        <span class="key">合计金额:</span>
                        <span>{{formObj.moneyReceived}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="key">合计金额大写:</span>
                        <span>{{formObj.sumRecevied}}</span>
                    </el-col>
                </el-row>
                <el-row style=" margin-top: 5px;">
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
                <el-row style=" margin-top: 5px;">
                    <el-col :span="6">
                        <span class="key">制单:</span>
                        <span>{{formObj.formCreator}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="key">出库复核:</span>
                        <span>{{formObj.outEntrepotCheck}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="key">发货人:</span>
                        <span>{{formObj.shipper}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="key">收货人:</span>
                        <span>{{formObj.consignee}}</span>
                    </el-col>
                </el-row>
                <el-row style=" margin-top: 5px;">
                    <el-col :span="24">
                        <span class="key">地址:</span>
                        <span>{{formObj.saleUnitAdress}}</span>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--endprint1-->
    </div>
</template>
<script>
import moment from "moment";
export default {
    props: {
        formObj: {
            type: Object,
            default: () => {
                return {};
            },
        },
        tableList: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {
        // 打印新增
        printHtml() {
            let k = $("#template").prop("outerHTML");
            $("body *").hide();
            $("body").append(k);
            $("body #template:last").css("display", "block");
            window.print();
            $("body *").show();
            $("body #template:last").remove();
            $("body #template:last").css("display", "none");
            this.$router.go(0);
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


