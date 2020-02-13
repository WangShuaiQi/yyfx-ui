import Vue from 'vue'
import Index from '@/template/channel/index'
import TodayTunnel from '@/template/channel/today-tunnel'
import TunnelFlow from '@/template/channel/tunnel-flow'

describe('测试通道首页', () => {
    describe('测试mapInstance变量', function(){
        it('mapInstance变量应该是字符串',function(){
            var Constructor = Vue.extend(Index)
            var vm = new Constructor().$mount()
            expect(vm.mapInstance).to.be.a('string')
        })
    })
})


describe('测试今日通道', () => {
    describe('测试今日通道添加通道模态框', function(done){
        it('点击通道报备，状态变量：addTunnel应该变为true', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.add-tunnel')[1];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.$store.state.addTunnelModal).to.equal(true)
                done();
            },500)
        })
    })
})


describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击"环川"，form.examinePointType的值应该是"环川"', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[0];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('环川')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击环川，form.examinePointType的值应该是""', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[0];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击环川，环川选项卡应该有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[0];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.include('active')
                done();
            },100)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击环川，环川选项卡应该没有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[0];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.not.include('active')
                done();
            },100)
        })
    })
})



describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击"环蓉"，form.examinePointType的值应该是"环蓉"', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[1];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('环蓉')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击环蓉，form.examinePointType的值应该是""', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[1];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击环蓉，环蓉选项卡应该有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[1];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.include('active')
                done();
            },100)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击环蓉，环蓉选项卡应该没有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[1];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.not.include('active')
                done();
            },100)
        })
    })
})



describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击"涉藏"，form.examinePointType的值应该是"涉藏"', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[2];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('涉藏')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击涉藏，form.examinePointType的值应该是""', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[2];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击涉藏，涉藏选项卡应该有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[2];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.include('active')
                done();
            },100)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击涉藏，涉藏选项卡应该没有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[2];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.not.include('active')
                done();
            },100)
        })
    })
})



describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击"机场"，form.examinePointType的值应该是"机场"', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[3];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('机场')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击机场，form.examinePointType的值应该是""', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[3];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击机场，机场选项卡应该有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[3];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.include('active')
                done();
            },100)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击机场，机场选项卡应该没有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[3];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.not.include('active')
                done();
            },100)
        })
    })
})


describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击"火车站"，form.examinePointType的值应该是"火车站"', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[4];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('火车站')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击火车站，form.examinePointType的值应该是""', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[4];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击火车站，火车站选项卡应该有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[4];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.include('active')
                done();
            },100)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击火车站，火车站选项卡应该没有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[4];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.not.include('active')
                done();
            },100)
        })
    })
})




describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击"码头"，form.examinePointType的值应该是"码头"', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[5];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('码头')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击码头，form.examinePointType的值应该是""', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[5];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            window.setTimeout(()=>{
                expect(vm.data.form.examinePointType).to.equal('')
                done();
            },500)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('点击码头，码头选项卡应该有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[5];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.include('active')
                done();
            },100)
        })
    })
})

describe('测试今日通道', () => {
    describe('测试今日通道通道类型选项卡', function(done){
        it('再次点击码头，码头选项卡应该没有active类', function(){
            var Constructor = Vue.extend(TodayTunnel)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.tabs>div')[5];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(button.classList).to.not.include('active')
                done();
            },100)
        })
    })
})

describe('测试今日通道流量统计', () => {
    describe('测试今日通道通道流量统计列表', function(done){
        it('点击列表，应该弹出通道分析模态框', function(){
            var Constructor = Vue.extend(TunnelFlow)
            var vm = new Constructor().$mount()
            const button = vm.$el.querySelectorAll('.rank')[0];
            const clickEvent = new window.Event('click')

            button.dispatchEvent(clickEvent)

            vm._watcher.run();
            setTimeout(function(){
                expect(vm.$store.state.todayFlowDetailModal.flg).to.equal(true)
                done();
            },100)
        })
    })
})

