/* 
 * Copyright 2016 danielunag.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*******************************************************************************
 * @description Clase que construye el menú "Archivística", agregando cada uno de 
 *              los modulos que este contiene.
 *              
 * @returns {ArchivalClass}
 */


var ArchivalClass = function () {
    var self = this;

    this.buildModule = function () {
        console.log("Construyendo Módulo Archivística...");

        var li = $('<li>', {class: "here LinkArchival"});
        var vigenciDocLi = $('<li>', {class: "here LinkDocumentaryValidity"}).append('<a href = "#">Vigencia Documental</a>');
        var fundamentoLegal = $('<li>', {class: "here LinkLegalFoundation"}).append('<a href = "#">Fundamento Legal</a>');
        var dispDoc = $('<li>', {class: "LinkDocumentaryDisposition"}).append('<a href="#">Cat. de Dispos. Documental</a>');
        var administrativeUnit = $('<li>', {class: "LinkAdministrativeUnit"}).append('<a href="#">Unidad Administrativa</a>');
        var transfer = $('<li>', {class: "LinkTransfer"}).append('<a href="#">Transferencia</a>');
        var transferPermissions = $('<li>', {class: "LinkTransferPermissions"}).append('<a href="#">Permisos de transferencia</a>');

        var sublist = $('<ul>', {class: "sublist", id: "archivalMenuNavbar"}).append(dispDoc);
        sublist.append(vigenciDocLi);
        sublist.append(fundamentoLegal);
        sublist.append(administrativeUnit);
        sublist.append(transfer);
        sublist.append(transferPermissions);

        var a = $('<a>', {href: "#Disposición Documental"}).append("Archivística");

        li.append(a);
        li.append(sublist);

        $('#menu ul:first').append(li);

        _getModules();
    };

    var _getModules = function () {
        _getDocumentaryDisposition();
        _getDocumentaryValidity();
        _getLegalFoundation();
        _getAdministrativeUnit();
        _getExpedient();
        _getTemplateDesigner();
        _getFieldsAssociator();
        _getExpedientTag();
        _getTopography();
        _transfer();
        _transferPermissions();
    };

    /**
     * @description Construye interfaz de diseñador de plantillas de expediente.
     * @returns {Boolean}
     */
    var _getTemplateDesigner = function () {
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/TemplateDesigner.js")
                .done(function (script, textStatus) {
                    status = true;
                    var templateDesigner = $('<li>', {class: "LinkTemplateDesigner"}).append('<a href="#">Diseñador de Plantilla</a>');
                    $('#archivalMenuNavbar').append(templateDesigner);

                    TemplateDesigner = new TemplateDesigner();
                    TemplateDesigner.setActionToLink();
                })
                .fail(function (jqxhr, settings, exception) {
                });
        $.ajaxSetup({async: true});

        return status;
    };

    /*
     * @description Agrega el módulo de Disposición Documental al CSDocs.
     * @returns {Boolean}
     */
    var _getDocumentaryDisposition = function () {
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/DocumentaryDisposition.js")
                .done(function (script, textStatus) {
                    status = true;
                    documentaryDisposition = new DocumentaryDispositionClass();
                    documentaryDisposition.setActionToLinkDocumentaryDispositionMenu();
                })
                .fail(function (jqxhr, settings, exception) {
                });
        $.ajaxSetup({async: true});

        return status;
    };

    /**
     * @description Construye la interfaz de valídez documental.
     * @returns {Boolean}
     */
    var _getDocumentaryValidity = function () {
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/DocumentaryValidity.js")
                .done(function (script, textStatus) {
                    status = true;
                    documentaryValidity = new DocumentaryValidity();
                    documentaryValidity.setActionToLinkDocumentaryValidity();
                })
                .fail(function (jqxhr, settings, exception) {
                });

        $.ajaxSetup({async: true});

        return status;
    };

    /***
     * @description Obtiene el script para ejecutar las funciones de la clase Fundamento Legal.
     * @returns {Boolean}
     */
    var _getLegalFoundation = function () {
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/LegalFoundation.js")
                .done(function (script, textStatus) {
                    status = true;
                    legalFoundation = new LegalFoundation();
                    legalFoundation.setActionToLink();
                })
                .fail(function (jqxhr, settings, exception) {
                });

        $.ajaxSetup({async: true});

        return status;
    };

    /**
     * @description Construye interfaz de la Unidad Administrativa.
     * @returns {Boolean}
     */
    var _getAdministrativeUnit = function () {
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/AdministrativeUnit.js")
                .done(function (script, textStatus) {
                    status = true;
                    administrativeUnit = new AdministrativeUnit();
                    administrativeUnit.setActionToLink();
                })
                .fail(function (jqxhr, settings, exception) {
                });

        $.ajaxSetup({async: true});

        return status;
    };

    /**
     * @description Se crea la instancia para el módulo expediente.
     * @returns {Boolean}
     */
    var _getExpedient = function () {
        console.log("contruyendo menú expediente.");
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/Expedient.js")
                .done(function (script, textStatus) {
                    status = true;
                    Expedient = new ExpedientClass();
                })
                .fail(function (jqxhr, settings, exception) {
                });

        $.ajaxSetup({async: true});

        return status;
    };

    var _getFieldsAssociator = function () {
        console.log("Construyendo menú Asociación de Campos");

        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/FieldsAssociator.js")
                .done(function (script, textStatus) {
                    status = true;
                    var fieldsAssociatorItem = $('<li>', {class: "LinkFieldsAssociator"}).append('<a href="#">Asociar Campos</a>');
                    $('#archivalMenuNavbar').append(fieldsAssociatorItem);
                    fieldsAssociator = new FieldsAssociator();
                    fieldsAssociator.setActionToLink();
                })
                .fail(function (jqxhr, settings, exception) {
                });

        $.ajaxSetup({async: true});

        return status;

    };
     
    var _getExpedientTag = function(){
        console.log("Construyendo control de etiquetas de expediente.");       
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/ExpedientTag.js")
                .done(function (script, textStatus) {
                    status = true;
                    expedientTag = new ExpedientTag();
                })
                .fail(function (jqxhr, settings, exception) {
                });

        $.ajaxSetup({async: true});

        return status;
    };
    
        var _getTopography = function(){
        console.log("Construyendo control de topografia.");       
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/Topography.js")
                .done(function (script, textStatus) {
                    status = true;
                    var templateDesigner = $('<li>', {class: "LinkTopography"}).append('<a href="#">Topografia</a>');
                    $('#archivalMenuNavbar').append(templateDesigner);
                    topografyClass = new Topography();
                    topografyClass.setActionToLink();
                })
                .fail(function (jqxhr, settings, exception) {
                });

        $.ajaxSetup({async: true});

        return status;
    };
    
    var _transfer = function(){
        console.log("Construyendo control de Transferencia.");       
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/Transfer.js")
                .done(function (script, textStatus) {
                    status = true;
//                    var templateDesigner = $('<li>', {class: "transferModuleLink"}).append('<a href="#">Transferencia</a>');
//                    $('#archivalMenuNavbar').append(templateDesigner);
                    TransferClass = new Transfer();
                   TransferClass.setActionToLink();
                })
                .fail(function (jqxhr, settings, exception) {
                });

        $.ajaxSetup({async: true});

        return status;
    };

    var _transferPermissions = function(){
        console.log("Construyendo Permisos de Transferencia.");
        var status = false;
        $.ajaxSetup({async: false});
        $.getScript("Modules/js/TransferPermissions.js")
                .done(function (script, textStatus) {
                    status = true;
//                    var templateDesigner = $('<li>', {class: "transferModuleLink"}).append('<a href="#">Transferencia</a>');
//                    $('#archivalMenuNavbar').append(templateDesigner);
                    TransferPermissionsClass = new TransferPermissions();
                    TransferPermissionsClass.setActionToLink();
                })
                .fail(function (jqxhr, settings, exception) {
                });

        $.ajaxSetup({async: true});

        return status;
    };
};