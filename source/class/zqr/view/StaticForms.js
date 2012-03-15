
/* ************************************************************************
    Соединение описания форм с элементами меню
************************************************************************ */

qx.Class.define("zqr.view.StaticForms",
{
    extend : Object,

    statics : {
        
        // мастер создания и редактирования рекламной компании
        acvVideoCreate : function(biz, Row, formDescr) {
            return new zqr.view.Form.AcvVideoCreateMaster(biz, Row, formDescr);
        },

        // мастер создания и редактирования рекламной компании
        acvVideoCopy : function(biz, Row, formDescr) {
            // пока показываем тоже самое, что и при создании
            return new zqr.view.Form.AcvVideoCreateMaster(biz, Row, formDescr);
        },
        
        // мастер создания и редактирования рекламной компании
        acvVideoShow : function(biz, Row, formDescr) {
            // пока показываем тоже самое, что и при создании
            return new zqr.view.Form.AcvVideoShow(biz, Row, formDescr);
        },
        
        
        /// Форма создания и редактирования групп пользователей
        customerGroupForm : function(biz, Row, formDescr) {
            return new zqr.view.Form.CustomerGroupForm(biz, Row, formDescr);
        },
        
        /// Форма создания и редактирования пользователей
        customerForm : function(biz, Row, formDescr) {
            return new zqr.view.Form.CustomerForm(biz, Row, formDescr);
        },
        
        /// Форма редактирования пара метров
        configForm : function(biz, Row, formDescr) {
            return new zqr.view.Form.ConfigForm(biz, Row, formDescr);
        }
    }
});

