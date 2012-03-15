/* ************************************************************************
    https://gist.github.com/1639960
************************************************************************ */

qx.Class.define("zqr.view.Form.AcvVideoCreateMaster.RegionTargeting",
{
    extend : zqr.view.Form.AcvVideoCreateMaster.BasePage,
    
    construct : function(uReq, Row, Options) {
        this.Options = Options;
        this.base(arguments, uReq, Row, Options);
    },

    members : {
        
        /* Upload request берется из конструктора */
        uReq : null,
        
        /* Download request делаем сами*/
        dReq : null,
        
        /**
         * Download  request config
         *
         * Предполагается, что загружать данные каждая страница
         * мастера будет самостоятельно, а вот выгружаться на сервер они будут
         * одним запросом.
         * 
        **/
        drc : {
            url: "/get-acv-video/region-targeting",
            method: "GET",                  // POST \ GET
            mimetype: "application/json"    // application/json
        },
        
        getComposite : function(){
            return this.composite;
        },

        regionListOptions: {
            url:            "/get-contries-sng",
            labelFieldName: "name_ru",
            descrFieldName: "name_ru"
        },
        
        buildForm : function(){
            var RFM = zqr.view.Form.AbstractForm.REQUIRED_FIELD_MARKER;
            var pageName = new qx.ui.basic.Label()
                .set({
                    value: "Таргетирование по регионам",  font: "bold",
                    alignX: "left", rich : true
                });
            var layout = new qx.ui.layout.Grid(2, 1);
            layout.setColumnFlex(0, 1);
            layout.setColumnAlign(0, "right", "top");
            this.composite  = new qx.ui.container.Composite(layout);
            this.composite.setWidth(zqr.Config.MASTER_FORM_WIDTH_M);
            
            
            this.inp.List = new zqr.view.
                SelListTreeDirs(
                    this,
                    this.regionListOptions.url,
                    this.regionListOptions.labelFieldName,
                    this.regionListOptions.descrFieldName,
                    this.Options
                );

            this.inp.List.setHeight(zqr.Config.SELLISTTREE_HEIGHT);

            var vertical_offset = -1;
            this.composite.add(pageName,
                {row:++vertical_offset, column:0});
            this.composite.add(this.inp.List,
                {row:++vertical_offset, column:0});
            return this.composite;
        },
        
        
        /**
            Заполняет форму полученными данными.
        **/
        fillForm : function(data) {
            var list = [];
            for(var geo in data.values){
                list.push(geo.id);
            }
            this.groupList.setChecked(list);
        },
        
        /**
            Проверяет коректность данных
        **/
        validateForm : function() {
            var flag = true;
            return flag;
        },
        

        /**
            Применив некоторые преобразования <<загружает>> данные на сервер
        **/
        saveData : function(e) {
            var list = this.inp.List.getSelectedId();
            if(this.validateForm()) {
                this.uReq.setParameter("geo_list", list, true);
            }
            return true;
        }
    }
});

