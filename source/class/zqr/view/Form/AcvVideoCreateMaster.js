/* ************************************************************************
    Мастер создания видео рекламы.
    
************************************************************************ */


qx.Class.define("zqr.view.Form.AcvVideoCreateMaster",
{

    extend : zqr.view.Form.AbstractForm,

    construct : function(controller, Row) {
        
        if(Row)
            this.createNew = (Row.isNew == true);
        this.base(arguments, controller, Row);
        
        this.counterLabel = new qx.ui.basic.Label();
        // кнопки
        // ---------------------------------------------------------------
        this.nextButton =  new qx.ui.form.Button("Далее");
        this.nextButton.addListener("execute", this._onNextClick, this);
        this.prevButton =  new qx.ui.form.Button("Назад");
        this.prevButton.addListener("execute", this._onPrevClick, this);
        this.cancelButton = new qx.ui.form.Button("Отмена");
        this.cancelButton.addListener("execute", this._onCancelClick, this);
        this.sendButton = new qx.ui.form.Button("Послать!");
        this.sendButton.addListener("execute", this._onSendClick, this);
        
        this.__hidebutton(this.sendButton);
        this.__hidebutton(this.prevButton);
        // ---------------------------------------------------------------
        
        // запрос
        // ---------------------------------------------------------------
        this.uReq = new qx.io.remote.Request
            (this.urc.url, this.urc.method, this.urc.mimetype);
        // ---------------------------------------------------------------
        
        // список окон
        // ---------------------------------------------------------------
        this.__list = [];
        
        console.log("!");
        this.__list.push(new zqr.view.Form.AcvVideoCreateMaster.Common(this.uReq, Row, true));
        console.log("Common");
        this.__list.push(new zqr.view.Form.AcvVideoCreateMaster.Upload(this.uReq, Row));
        console.log("Upload");
        this.__list.push(new zqr.view.Form.AcvVideoCreateMaster.Show(this.uReq, Row));
        console.log("Show");
        this.__list.push(new zqr.view.Form.AcvVideoCreateMaster.UsersTargeting(this.uReq, Row));
        console.log("UsersTargeting");
        this.__list.push(new zqr.view.Form.AcvVideoCreateMaster.RegionTargeting(this.uReq, Row));
        console.log("RegionTargeting");
        this.__list.push(new zqr.view.Form.AcvVideoCreateMaster.CategoryTargeting(this.uReq, Row));
        console.log("CategoryTargeting");
        
        this.__step = 0;
        this.__length = this.__list.length;
        // ---------------------------------------------------------------

        this.buildForm();
        this.addListeners();
        this.showCurrentPage();
    },
    
    members : {
        
        urc : {
            url:        "/update-acv-video",
            imgurl:     "/update-acv-video/upload-video",
            method:     "POST",
            mimetype:   "application/json"
        },
        
        __step:     null,     // шаг мастера
        __list :   null,      // формы мастера
        __length :  null,     // длинна мастера
        placeholder : null,
        
        __hidebutton: function(but){
            but.setEnabled(false);
        },
        
        __showbutton: function(but){
            but.setEnabled(true);
        },
        
        __gotoNext : function(){
            if(this.__step < this.__getLength() - 1){
                this.__step += 1;
                if(this.__step == this.__getLength() - 1){
                    this.__hidebutton(this.nextButton);
                    this.__showbutton(this.sendButton);
                }
            }
            else{
                this.__hidebutton(this.nextButton);
                this.__showbutton(this.sendButton);
            }
            this.__showbutton(this.prevButton);
        },
        
        __gotoPrev : function(){
            if(0 < this.__step){
                this.__step -= 1;
                if(0 == this.__step)
                    this.__hidebutton(this.prevButton);
            }
            else{
                this.__hidebutton(this.prevButton);
            }
            this.__hidebutton(this.sendButton);
            this.__showbutton(this.nextButton);
        },
        
        __getCur : function(){
            return this.__list[this.__step];
        },

        __delCur : function(){
            this.placeholder.removeAll();
        },
        
        validateCurrent : function(){
            var formIsValid = false;
            var cur = this.__getCur();
            if(cur["saveData"]){
                formIsValid = cur.saveData();
            }
            return formIsValid;
        },
        
        showCurrentPage : function(){
            var cur = this.__getCur();
            this.placeholder.add(cur.getComposite());
            this.counterLabel.setValue("Шаг " + (1 + this.__step) +
                " из " + this.__getLength() + ".");
        },
        
        __getLength : function(){
            return this.__length;
        },
        
        d: function(){console.log(arguments);},
        
        buildForm : function(){
            var layout = new qx.ui.layout.Grid(1, 1);
            var cnt = new qx.ui.container.Composite(layout);
            layout.setColumnFlex(0, 1);
            layout.setColumnAlign(0, "left", "top");
            var work_layout = new qx.ui.layout.VBox(1);
            this.placeholder = new qx.ui.container.Composite(work_layout);
            // -------------------------------------------------------------
            var vertical_offset = -1;
            cnt.add(this.counterLabel,  {row:++vertical_offset, column:0});
            cnt.add(this.placeholder,   {row:++vertical_offset, column:0});
            this.addbuttonRow(cnt,      ++vertical_offset);
            // -------------------------------------------------------------
            this.controller.placeForm(cnt);
            return {controller : cnt, offset: vertical_offset};
        },
        
        addbuttonRow: function(cnt, vertical_offset) {
            var buttonRow = new qx.ui.container.Composite();
            buttonRow.setMarginTop(5);
            var hbox = new qx.ui.layout.HBox(5);
            hbox.setAlignX("right");
            buttonRow.setLayout(hbox);
            buttonRow.add(this.prevButton);
            buttonRow.add(this.nextButton);
            buttonRow.add(this.cancelButton);
            buttonRow.add(this.sendButton);
            cnt.add(buttonRow, {row:vertical_offset , column:0, colSpan:3});
        },
        
        addListeners: function() {
            var _this = this;
        },
        
        _onNextClick: function() {
            if(this.validateCurrent()){
                this.__delCur();
                this.__gotoNext();
                this.showCurrentPage();
            }
         },
         
        _onPrevClick: function() {
            if(this.validateCurrent()){
                this.__delCur();
                this.__gotoPrev();
                this.showCurrentPage();
            }
         },
         
        _onCancelClick : function(e) {
            this.controller.onCancelClick();
        },
        
        _onSendClick: function() {
            if(this.validateCurrent()){
                if(this.uReq){
                    this.submit(this.uReq);
                }
            }
        },
        
        /**
         * Проверяет коректность ВСЕХ данных.
        **/
        validateForm : function() {
            var flag = true;
            for(var i = 0; i!=  this.__list.length ; ++i){
                flag = flag && this.__list[i].validateForm();
            }
            return flag;
        }
    }
});

