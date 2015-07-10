/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global EnvironmentData, BotonesWindow, ConsoleSettings, LanguajeDataTable, DimensionsDialogNewRegister, DimensionsDialogMetadatas */

var EnterprisedT, EnterpriseDT;

$(document).ready(function () {
    $('.LinkEnterprise').click(function () {
        var Enterprise = new ClassEnterprise();
        Enterprise.BuildConsole();
    });
});
var ClassEnterprise = function ()
{
    var self = this;

    _DisplayWindowFields = function ()
    {
        var fieldsManager = new FieldsManager();
        fieldsManager.BuildWindow();

        var buttons = {"Cancelar": function () {
                $(this).remove();
            },
            "Agregar": {text: "Agregar", click: function () {
                    _ValidateNewField();
                }}};

        $('#DivFormsNewField').dialog('option', 'buttons', buttons);
    };

    _ValidateNewField = function ()
    {
        var fieldsManager = new FieldsManager();
        var FieldsValues = fieldsManager.GetFieldsValues(EnterprisedT, EnterpriseDT);
        if (!$.isPlainObject(FieldsValues))
            return 0;

        _AddNewField(FieldsValues);

    };

    _AddNewField = function (FieldsValues)
    {
        var data = {option: 'NewField', DataBaseName: EnvironmentData.DataBaseName, IdUser: EnvironmentData.IdUsuario, UserName: EnvironmentData.NombreUsuario, FieldName: FieldsValues.FieldName, FieldType: FieldsValues.FieldType, FieldLength: FieldsValues.FieldLength, RequiredField: FieldsValues.RequiredField};

        $.ajax({
            async: false,
            cache: false,
            dataType: "html",
            type: 'POST',
            url: "php/Enterprise.php",
            data: data,
            success: function (xml)
            {
                if ($.parseXML(xml) === null) {
                    Error(xml);
                    return 0;
                } else
                    xml = $.parseXML(xml);

                if ($(xml).find('AddedField').length > 0)
                {
                    var Mensaje = $(xml).find('Mensaje').text();
                    Notificacion(Mensaje);

                    /*  Se reconstruye la ventana para agregar un nuevo campo y se selecciona el campo agregado sobre la tabla */
                    var fieldsManager = new FieldsManager();
                    fieldsManager.BuildWindow();

                    var buttons = {"Cancelar": function () {
                            $(this).remove();
                        }, "Agregar": {text: "Agregar", click: function () {
                                _ValidateNewField();
                            }}};

                    $('#DivFormsNewField').dialog('option', 'buttons', buttons);

                    $('#TableEnterpriseDetail tr').removeClass('selected');

                    var FieldProperties = [FieldsValues.FieldName, FieldsValues.FieldType, FieldsValues.FieldLength, FieldsValues.RequiredField];

                    var ai = EnterpriseDT.row.add(FieldProperties).draw();
                    var n = EnterprisedT.fnSettings().aoData[ ai[0] ].nTr;
                    n.setAttribute('class', "selected");

                }

                $(xml).find("Error").each(function ()
                {
                    var $Error = $(this);
                    var mensaje = $Error.find("Mensaje").text();
                    Error(mensaje);
                });

            },
            beforeSend: function () {
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Error(textStatus + "<br>" + errorThrown);
            }
        });

    };

    _ConfirmDeleteField = function ()
    {
        var FieldSelected = $('#TableEnterpriseDetail tr.selected');
        var FieldName, data;

        if (FieldSelected.length !== 1)
            return Advertencia("Debe seleccionar un campo");

        EnterprisedT.$('tr.selected').each(function ()
        {
            var position = EnterprisedT.fnGetPosition(this); // getting the clicked row position
            FieldName = EnterprisedT.fnGetData(position)[0];
        });

        $('#divConfirmDeleteField').remove();
        $('body').append('<div id = "divConfirmDeleteField"></div>');
        $('#divConfirmDeleteField').append("<p>¿Realmente desea eliminar el campo <b>" + FieldName + "</b>? esta acción no puede revertirse</p>");
        $('#divConfirmDeleteField').dialog({title: "Mensaje de confirmación", width: 300, minWidth: 150, height: 250, minHeight: 150, modal: true, buttons: {
                Cancelar: function () {
                    $(this).remove();
                },
                Aceptar: function () {
                    _DeleteField();
                }
            }});

    };

    _DeleteField = function ()
    {
        var FieldSelected = $('#TableEnterpriseDetail tr.selected');
        var FieldName, data;

        if (FieldSelected.length !== 1)
            return Advertencia("Debe seleccionar un campo");

        EnterprisedT.$('tr.selected').each(function ()
        {
            var position = EnterprisedT.fnGetPosition(this); // getting the clicked row position
            FieldName = EnterprisedT.fnGetData(position)[0];
        });

        data = {option: "DeleteField", DataBaseName: EnvironmentData.DataBaseName, IdUser: EnvironmentData.IdUsuario, UserName: EnvironmentData.NombreUsuario, IdGroup: EnvironmentData.IdGrupo, GroupName: EnvironmentData.NombreGrupo, FieldName: FieldName};

        $.ajax({
            async: false,
            cache: false,
            dataType: "html",
            type: 'POST',
            url: "php/Enterprise.php",
            data: data,
            success: function (xml)
            {
                if ($.parseXML(xml) === null) {
                    Error(xml);
                    return 0;
                } else
                    xml = $.parseXML(xml);

                if ($(xml).find('DeletedField').length > 0)
                {
                    $('#divConfirmDeleteField').remove();
                    var Mensaje = $(xml).find('Mensaje').text();
                    Notificacion(Mensaje);
                    EnterpriseDT.row('tr.selected').remove().draw(false);
                    EnterprisedT.$('tbody tr:first').click();

                }

                $(xml).find("Error").each(function ()
                {
                    var $Error = $(this);
                    var mensaje = $Error.find("Mensaje").text();
                    Error(mensaje);
                });

            },
            beforeSend: function () {
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Error(textStatus + "<br>" + errorThrown);
            }
        });
    };

    /*******************************************************************************************************************************************
     *                                              OPCION LISTADO DE EMPRESAS 
     /******************************************************************************************************************************************/

    _FormsNewEnterprise = function ()
    {
        console.log("FormsNewEnterprise:::");

        $('#DivFormsNewEnterprise').remove();
        $('body').append('<div id = "DivFormsNewEnterprise"></div>');

        $('#DivFormsNewEnterprise').dialog(DimensionsDialogMetadatas, {title: "Nueva Empresa", buttons: {Cerrar: function () {
                    $(this).remove();
                }}});


        $('#DivFormsNewEnterprise').append('<div class="Loading" id = "IconWaitingEnterprise"><img src="../img/loadinfologin.gif"></div>');

        $('#DivFormsNewEnterprise').append('<table id = "TableEnterpriseNewRegister"></table>');

        var EnterpriseStructure = GetAllStructure("Empresa");

        $('#IconWaitingEnterprise').remove();

        if ($.type(EnterpriseStructure) !== 'object')
            return Error("No fué posible recuperar la estructura de empresas");
        console.log(EnterpriseStructure);
        BuildFullStructureTable("Empresa", 'TableEnterpriseNewRegister', EnterpriseStructure);

        var Forms = $('#DivFormsNewEnterprise input');
        var FieldsValidator = new ClassFieldsValidator();
        FieldsValidator.InspectCharacters(Forms);

        var buttons = {
            "Cancelar": function () {
                $(this).remove();
            },
            "Agregar": function () {
                _AddNewEnterprise(EnterpriseStructure);
            }
        };

        $('#DivFormsNewEnterprise').dialog('option', 'buttons', buttons);



    };

    /* Agrega un nuevo registro  */
    _AddNewEnterprise = function (EnterpriseStructure)
    {
        console.log("AddingNewRegister::");

        var RegularExpression = /^([a-zA-Z0-9\_])+$/g;
        var Forms = $('#DivFormsNewEnterprise input');
        var FieldsValidator = new ClassFieldsValidator();

        var validation = FieldsValidator.ValidateFields(Forms);
        if (validation === 0)
            return;

        var Data = [];

        var xml = "<AddNewRegister version='1.0' encoding='UTF-8'>";

        $(EnterpriseStructure).find("Campo").each(function ()
        {
            var $Campo = $(this);
            var name = $Campo.find("name").text();
            var type = $Campo.find("type").text();
            var long = $Campo.find("long").text();
            var required = $Campo.find("required").text();
            var value = $('#TableEnterpriseNewRegister_' + name).val();
            
            if(name === "ClaveEmpresa")
            {
                value = String(value);
                value = value.toUpperCase();
            }
            
            if (value !== "")
                xml += '<Campo>\n\
                    <name>' + name + '</name>\n\
                    <value>' + value + '</value>\n\
                    <type>' + type + '</type>\n\
                    <long>' + long + '</long>\n\
                    <required>' + required + '</required>\n\
                 </Campo>';
            
            Data[Data.length] = value;

        });

        xml += '</AddNewRegister>';

        var EnterpriseKey = $('#TableEnterpriseNewRegister_ClaveEmpresa').val();

        if (!RegularExpression.test(EnterpriseKey))
        {
            $('#TableEnterpriseNewRegister_ClaveEmpresa').attr('title', 'El campo no debe contener espacios y únicamente letras y números');
            $('#TableEnterpriseNewRegister_ClaveEmpresa').tooltip();
            return FieldsValidator.AddClassRequiredActive($('#TableEnterpriseNewRegister_ClaveEmpresa'));
        }
        else
            FieldsValidator.RemoveClassRequiredActive($('#TableEnterpriseNewRegister_ClaveEmpresa'));
        
        EnterpriseKey = String(EnterpriseKey);
        EnterpriseKey = EnterpriseKey.toUpperCase();
        
        $('#EnterpriseWS').append('<div class="Loading" id = "IconWaitingEnterprise"><img src="../img/loadinfologin.gif"></div>');


        var data = {option: "AddNewRegister", DataBaseName: EnvironmentData.DataBaseName, IdUser: EnvironmentData.IdUsuario, UserName: EnvironmentData.NombreUsuario, IdGroup: EnvironmentData.IdGrupo, GroupName: EnvironmentData.NombreGrupo, xml: xml};

        $.ajax({
            async: false,
            cache: false,
            dataType: "html",
            type: 'POST',
            url: "php/Enterprise.php",
            data: data,
            success: function (xml)
            {
                $('#IconWaitingEnterprise').remove();

                if ($.parseXML(xml) === null) {
                    Error(xml);
                    return 0;
                } else
                    xml = $.parseXML(xml);

                if ($(xml).find('AddedNewRecord').length > 0)
                {
                    $('#EnterprisesTable tr').removeClass('selected');

                    var Mensaje = $(xml).find('Mensaje').text();
                    Notificacion(Mensaje);

                    var IdEnterprise = $(this).find('NewIdEnterprise').text();

                    var ai = EnterpriseDT.row.add(Data).draw();
                    var n = EnterprisedT.fnSettings().aoData[ ai[0] ].nTr;
                    n.setAttribute('class', "selected");
                    n.setAttribute('id', IdEnterprise);

                    $('#DivFormsNewEnterprise').remove();
                }

                $(xml).find("Error").each(function ()
                {
                    var $Error = $(this);
                    var mensaje = $Error.find("Mensaje").text();
                    Error(mensaje);
                });

            },
            beforeSend: function () {
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Error(textStatus + "<br>" + errorThrown);
            }
        });


    };

    _ConfirmationDeleteEnterprise = function ()
    {
        var EnterpriseSelected = $('#EnterprisesTable tr.selected');
        var IdEnterprise, EnterpriseKey, index, cont = 0;

        if (EnterpriseSelected.length !== 1)
            return Advertencia("Debe seleccionar una empresa");

        var NumColumns = EnterpriseDT.columns().header();
        $(NumColumns).each(function ()
        {
            var ColumnTitle = $(this).html();
            if (ColumnTitle === "ClaveEmpresa")
                index = cont;

            cont++;
        });

        if (index === undefined)
            return Advertencia("No existe el campo ClaveEmpresa, no es posible realizar esta acción");

        EnterprisedT.$('tr.selected').each(function ()
        {
            var position = EnterprisedT.fnGetPosition(this); // getting the clicked row position
            IdEnterprise = $(this).attr('id');
            EnterpriseKey = EnterprisedT.fnGetData(position)[index];
        });

        $('#DivConfirmationDeleteEnterprise').remove();
        $('body').append('<div id = "DivConfirmationDeleteEnterprise"></div>');
        $('#DivConfirmationDeleteEnterprise').append('<p>¿Realmente desea eliminar la empresa <b>' + EnterpriseKey + '</b>? Esta operación eliminará los repositorios ligados a esta empresa y no puede revertirse.</p><p>¿Desea continuar?</p>');
        $('#DivConfirmationDeleteEnterprise').dialog({width: 300, minWidth: 150, Height: 250, minHeight: 150, modal: true, title: "Mensaje de confirmación", buttons: {
                Cancelar: function () {
                    $(this).remove();
                },
                Aceptar: function () {
                    _DeleteEnterprise(IdEnterprise, EnterpriseKey[0]);
                }
            }});


    };

    _DeleteEnterprise = function (IdEnterprise, EnterpriseKey)
    {

        $('#EnterpriseWS').append('<div class="Loading" id = "IconWaitingEnterprise"><img src="../img/loadinfologin.gif"></div>');

        var data = {option: "DeleteEnterprise", DataBaseName: EnvironmentData.DataBaseName, IdUser: EnvironmentData.IdUsuario, UserName: EnvironmentData.NombreUsuario, IdGroup: EnvironmentData.IdGrupo, GroupName: EnvironmentData.NombreGrupo, IdEnterprise: IdEnterprise, EnterpriseKey: EnterpriseKey};

        $.ajax({
            async: false,
            cache: false,
            dataType: "html",
            type: 'POST',
            url: "php/Enterprise.php",
            data: data,
            success: function (xml)
            {
                $('#IconWaitingEnterprise').remove();

                if ($.parseXML(xml) === null) {
                    Error(xml);
                    return 0;
                } else
                    xml = $.parseXML(xml);

                if ($(xml).find('DeletedEnterprise').length > 0)
                {
                    $('#DivConfirmationDeleteEnterprise').remove();
                    
                    var Mensaje = $(xml).find('Mensaje').text();
                    Notificacion(Mensaje);

                    EnterpriseDT.row('tr.selected').remove().draw(false);
                    EnterprisedT.$('tbody tr:first').click();
                }

                $(xml).find("Error").each(function ()
                {
                    var $Error = $(this);
                    var mensaje = $Error.find("Mensaje").text();
                    Error(mensaje);
                });

            },
            beforeSend: function () {
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Error(textStatus + "<br>" + errorThrown);
            }
        });
    };

    _EditEnterprise = function (EnterpriseStructure)
    {
        var EnterpriseSelected = $('#EnterprisesTable tr.selected');
        var IdEnterprise, EnterpriseKey, index, RowIndexEnterpriseKey, cont = 0, Data = [];

        if (EnterpriseSelected.length !== 1)
            return Advertencia("Debe seleccionar una empresa");

        /* Índice donde se encuentra la columna ClaveEmpresa */
        var NumColumns = EnterpriseDT.columns().header();
        $(NumColumns).each(function ()
        {
            var ColumnTitle = $(this).html();
            if (ColumnTitle === "ClaveEmpresa")
                index = cont;

            cont++;
        });

        $('#DivEditEnterprise').remove();
        $('body').append('<div id = "DivEditEnterprise"></div>');
        $('#DivEditEnterprise').append('<table id = "TableEditEnterprise"></table>');

        BuildFullStructureTable("Empresa", "TableEditEnterprise", EnterpriseStructure);

        if (index === undefined)
            return Advertencia("No existe el campo ClaveEmpresa, no es posible realizar esta acción");

        EnterprisedT.$('tr.selected').each(function ()
        {
            var position = EnterprisedT.fnGetPosition(this); // getting the clicked row position
            IdEnterprise = $(this).attr('id');
            RowIndexEnterpriseKey = EnterpriseDT.row(position).index();
            EnterpriseKey = EnterprisedT.fnGetData(position)[index];
            for (var cont = 0; cont < NumColumns.length; cont++)
            {
                var FieldValue = EnterprisedT.fnGetData(position)[cont];
                Data[Data.length] = FieldValue[0];
            }
        });

        var aux = 0;
        $(EnterpriseStructure).find("Campo").each(function ()
        {
            var $Campo = $(this);
            var name = $Campo.find("name").text();
            var type = $Campo.find("type").text();
            var long = $Campo.find("long").text();
            var required = $Campo.find("required").text();

            var FieldValue = Data[aux];
            $('#TableEditEnterprise_' + name).val(FieldValue);
            aux++;
        });

        var validation = new ClassFieldsValidator();
        var forms = $('#TableEditEnterprise input')
        validation.InspectCharacters(forms);

        /* Se toman los datos de la tabla para poder editarlos en los formularios */

        $('#DivEditEnterprise').dialog(DimensionsDialogMetadatas, {title: "Información de empresa " + EnterpriseKey, buttons: {
                Cancelar: function () {
                    $(this).remove();
                },
                Modificar: function () {
                    _ModifyEnterprise(IdEnterprise, EnterpriseStructure, RowIndexEnterpriseKey, index, EnterpriseKey);
                }
            }});

    };

};

/* 
 * @ColumnIndexEnterpriseKey: Índice de la columna donde se encuentra el campo EnterpriseKey
 * @RowIndexEnterpriseKey: Índice de la fila donde se ubica el campo EnterpriseKey
 * @EnterpriseKey: Representa el inidice de la columna donde se encuentra este campo */

_ModifyEnterprise = function (IdEnterprise, EnterpriseStructure, RowIndexEnterpriseKey,  ColumnIndexEnterpriseKey, OriginalEnterpriseKey)
{
    console.log('Modifying Enterprise::');
    var newData = [];    /* Continue los nuevos datos  modificados por el usuario*/
    var RegularExpresion = /^([a-zA-Z0-9\_])+$/g;
    
    OriginalEnterpriseKey = String(OriginalEnterpriseKey);
    OriginalEnterpriseKey = OriginalEnterpriseKey.toUpperCase();

    var forms = $('#TableEditEnterprise input')

    var validation = new ClassFieldsValidator();
    var validationResult = validation.ValidateFields(forms)

    if (validationResult === 0)
        return;

    /* Se comprueba que no se duplique la clave de empresa */
    var ColumnValues = EnterpriseDT.column(ColumnIndexEnterpriseKey).data();

    var NewEnterpriseKey = $('#TableEditEnterprise_ClaveEmpresa').val();
    NewEnterpriseKey = String(NewEnterpriseKey);
    NewEnterpriseKey = NewEnterpriseKey.toUpperCase();
    
    if(!RegularExpresion.test(NewEnterpriseKey))
    {
        validation.AddClassRequiredActive($('#TableEditEnterprise_ClaveEmpresa'));
        $('#TableEditEnterprise_ClaveEmpresa').attr('title','Nombre de campo inválido');
        return 0;
    }      
    
    var IfRepeatedEnterpriseKey = strcmp(NewEnterpriseKey, OriginalEnterpriseKey);
    var FlagRepeatedEnterpriseKey = 0;
    if (IfRepeatedEnterpriseKey !== 0)
        $(ColumnValues).each(function ()
        {
            var ExistedEnterpriseKey = $(this)[0];
            ExistedEnterpriseKey = String(ExistedEnterpriseKey);
            ExistedEnterpriseKey = ExistedEnterpriseKey.toLowerCase();

            if(ExistedEnterpriseKey === NewEnterpriseKey)
                FlagRepeatedEnterpriseKey = 1;
                
        });
        
        if(FlagRepeatedEnterpriseKey)
            return Advertencia("La clave de empresa seleccionada ya existe.");

    /* Construcción de XML para enviar al servidor */
    var xml =
    "<ModifyEnterprise version='1.0' encoding='UTF-8'>";

    $(EnterpriseStructure).find("Campo").each(function ()
    {
        var $Campo = $(this);
        var name = $Campo.find("name").text();
        var type = $Campo.find("type").text();
        var long = $Campo.find("long").text();
        var required = $Campo.find("required").text();

        var FieldValue = $('#TableEditEnterprise_' + name).val();
        
            xml+= "\n\
            <Field>\n\
                <FieldName>"+   name    +"</FieldName> \n\
                <FieldValue>"+  FieldValue  +"</FieldValue> \n\
                <FieldType>"+   type    +" </FieldType>\n\
                <RequiredField>"+   required   +"</RequiredField>  \n\
            </Field>";
            
            newData[newData.length] = FieldValue;
    });
    
    xml+= "<OldEnterpriseKey>"+OriginalEnterpriseKey+" </OldEnterpriseKey>";
    xml+= "<NewEnterpriseKey>"+NewEnterpriseKey+" </NewEnterpriseKey>";

    
    xml+="</ModifyEnterprise>";
    
    $('#EnterpriseWS').append('<div class="Loading" id = "IconWaitingEnterprise"><img src="../img/loadinfologin.gif"></div>');
    
    
    var data = {option: "ModifyEnterprise", DataBaseName: EnvironmentData.DataBaseName, IdUser: EnvironmentData.IdUsuario, UserName: EnvironmentData.NombreUsuario, IdGroup: EnvironmentData.IdGrupo, GroupName: EnvironmentData.NombreGrupo, IdEnterprise: IdEnterprise, EnterpriseKey: NewEnterpriseKey, Xml:xml};
    
    $.ajax({
        async: false,
        cache: false,
        dataType: "html",
        type: 'POST',
        url: "php/Enterprise.php",
        data: data,
        success: function (xml)
        {
            $('#IconWaitingEnterprise').remove();

            if ($.parseXML(xml) === null) {Error(xml);return 0;} else xml = $.parseXML(xml);

            if ($(xml).find('ModifiedEnterprise').length > 0)
            {
                $('#DivEditEnterprise').remove();
                
                var Mensaje = $(xml).find('Mensaje').text();
                Notificacion(Mensaje);
                EnterpriseDT.row( RowIndexEnterpriseKey ).data( newData ).draw();
            }

            $(xml).find("Error").each(function ()
            {
                var $Error = $(this);
                var mensaje = $Error.find("Mensaje").text();
                Error(mensaje);
            });

        },
        beforeSend: function () {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Error(textStatus + "<br>" + errorThrown);
        }
    });

};

ClassEnterprise.prototype.BuildConsole = function ()
{
    var self = this;

    $('#DivEnterprisesManager').remove();
    $('body').append('\n\
        <div id="DivEnterprisesManager">\n\
        <div class="menu_lateral">\n\
                <div id="AccorEnterpriseManager">\n\
                    <div>\n\
                      <h3><a href="#">Empresas</a></h3>\n\
                      <div id = "ConsoleEnterpriseManager">\n\
                          <table class="TableInsideAccordion">\n\
                              <tr class = "tr_EnterpriseList" title="Empresas">\n\
                                  <td><img src="img/AddEnterprise.png" ></td>\n\
                                  <td>Empresas</td>\n\
                              </tr>\n\
                              <tr class = "tr_EnterpriseStructure" title="Administracion de Empresas">\n\
                                  <td><img src="img/enterprise.png" ></td>\n\
                                  <td>Estructura</td>\n\
                              </tr>\n\
                          </table>\n\
                      </div>\n\
                    </div>\n\
                </div>\n\
        </div>\n\
        <div class="work_space" id="EnterpriseWS"></div>\n\
    </div>');

    $("#AccorEnterpriseManager").accordion({header: "h3", collapsible: true, heightStyle: "content"});

    $('#DivEnterprisesManager').dialog({title: "Consola de Empresas"}, ConsoleSettings).dialogExtend(BotonesWindow);

    /********* Efectos sobre tabla dentro de acordeÃ³n ***********/
    $('#DivEnterprisesManager table').on('click', 'tr', function ()
    {
        var active = $('#DivEnterprisesManager table tr.TableInsideAccordionFocus');
        $('#DivEnterprisesManager table tr').removeClass('TableInsideAccordionFocus');
        $('#DivEnterprisesManager table tr').removeClass('TableInsideAccordionActive');
        $(active).addClass('TableInsideAccordionFocus');
        $(this).removeClass('TableInsideAccordionHoverWithoutClass');
        $(this).addClass('TableInsideAccordionActive');
    });
    $('#DivEnterprisesManager table tr').hover(function ()
    {
        if ($(this).hasClass('TableInsideAccordionActive') || $(this).hasClass('TableInsideAccordionFocus'))
            $(this).addClass('TableInsideAccordionHoverWithClass');
        else
            $(this).addClass('TableInsideAccordionHoverWithoutClass');
    });
    $('#DivEnterprisesManager table tr').mouseout(function ()
    {
        if ($(this).hasClass('TableInsideAccordionActive') || $(this).hasClass('TableInsideAccordionFocus'))
            $(this).removeClass('TableInsideAccordionHoverWithClass');
        else
            $(this).removeClass('TableInsideAccordionHoverWithoutClass');
    });

    /* Fin de Efectos  */

    $('.tr_EnterpriseStructure').click(function ()
    {
        self.AdminStructure();
    });
    $('.tr_EnterpriseList').click(function ()
    {
        self.DisplayEnterprises();
    });

    $('.tr_EnterpriseList').click();
};

ClassEnterprise.prototype.AdminStructure = function ()
{
    var self = this;

    $('#EnterpriseWS').empty();
    $('#EnterpriseWS').append('<div class="titulo_ventana">Estructura de Empresas</div>');
    $('#EnterpriseWS').append('<div class="Loading" id = "IconWaitingEnterprise"><img src="../img/loadinfologin.gif"></div>');

    var EnterpriseDetail = GeStructure('Empresa');

    $('#EnterpriseWS').append('<table id = "TableEnterpriseDetail" class = "display hover"></table>');
    $('#TableEnterpriseDetail').append('<thead><tr><th>Campo</th><th>Tipo</th><th>Longitud</th><th>Requerido</th></tr></thead>');

    EnterprisedT = $('#TableEnterpriseDetail').dataTable(
            {
                'bPaginate': false, 'bInfo': false, bFilter: false, "bSort": false, "autoWidth": false, "oLanguage": LanguajeDataTable, "dom": 'lfTrtip',
                "tableTools": {
                    "aButtons": [
                        {"sExtends": "text", "sButtonText": "Agregar Campo", "fnClick": function () {
                                _DisplayWindowFields();
                            }},
                        {"sExtends": "text", "sButtonText": "Eliminar Campo", "fnClick": function () {
                                _ConfirmDeleteField();
                            }},
                        {"sExtends": "copy", "sButtonText": "Copiar al portapapeles"},
                        {
                            "sExtends": "collection",
                            "sButtonText": "Guardar como...",
                            "aButtons": ["csv", "xls", "pdf"]
                        }
                    ]
                }
            });

    $('div.DTTT_container').css({"margin-top": "1em"});
    $('div.DTTT_container').css({"float": "left"});

    EnterpriseDT = new $.fn.dataTable.Api('#TableEnterpriseDetail');

    $('#TableEnterpriseDetail tbody').on('click', 'tr', function ()
    {
        EnterpriseDT.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    });

    /* Llenado de la tabla con los campos del repositorio */
    $(EnterpriseDetail).find('Campo').each(function ()
    {
        var FieldName = $(this).find('name').text();
        var FieldType = $(this).find('type').text();
        var FieldLength = $(this).find('long').text();
        var RequiredField = $(this).find('required').text();

        if (RequiredField === '' || RequiredField === 'false')
            RequiredField = "No";
        else
        if (RequiredField === 'true')
            RequiredField = "Si";

        var data = [FieldName, FieldType, FieldLength, RequiredField];

        var ai = EnterpriseDT.row.add(data).draw();
        var n = EnterprisedT.fnSettings().aoData[ ai[0] ].nTr;
//        n.setAttribute('id',self.AutoincrementId);

    });

    EnterprisedT.$('tbody tr:first').click();

    $('#IconWaitingEnterprise').remove();

};

ClassEnterprise.prototype.DisplayEnterprises = function ()
{
    var self = this;

    $('#EnterpriseWS').empty();
    $('#EnterpriseWS').append('<div class="titulo_ventana">Empresas del Sistema</div>');
    $('#EnterpriseWS').append('<div class="Loading" id = "IconWaitingEnterprises"><img src="../img/loadinfologin.gif"></div>');

    var FieldsArray = new Array();

    var th = '';

    var EnterpriseStructure = GetAllStructure('Empresa');

    $(EnterpriseStructure).find('Campo').each(function ()
    {
        var FieldName = $(this).find('name').text();
        var FieldType = $(this).find('type').text();
        var FieldLength = $(this).find('long').text();
        var RequiredField = $(this).find('required').text();
        th += "<th>" + FieldName + "</th>";

        var index = FieldsArray.length;
        $(this).attr('index', index);

        FieldsArray[index] = FieldName;
    });

    $('#EnterpriseWS').append('<table id = "EnterprisesTable" class = "display hover"><thead>' + th + '</thead></table>');

    EnterprisedT = $('#EnterprisesTable').dataTable(
            {
                'bPaginate': false, 'bInfo': false, bFilter: false, "bSort": false, "autoWidth": false, "oLanguage": LanguajeDataTable, "dom": 'lfTrtip',
                "tableTools": {
                    "aButtons": [
                        {"sExtends": "text", "sButtonText": "Nuevo", "fnClick": function () {
                                _FormsNewEnterprise();
                            }},
                        {"sExtends": "text", "sButtonText": "Editar", "fnClick": function () {
                                _EditEnterprise(EnterpriseStructure);
                            }},
                        {"sExtends": "text", "sButtonText": "Eliminar", "fnClick": function () {
                                _ConfirmationDeleteEnterprise();
                            }},
                        {"sExtends": "copy", "sButtonText": "Copiar al portapapeles"},
                        {
                            "sExtends": "collection",
                            "sButtonText": "Guardar como...",
                            "aButtons": ["csv", "xls", "pdf"]
                        }
                    ]
                }
            });

    $('div.DTTT_container').css({"margin-top": "1em"});
    $('div.DTTT_container').css({"float": "left"});

    EnterpriseDT = new $.fn.dataTable.Api('#EnterprisesTable');

    $('#EnterprisesTable tbody').on('click', 'tr', function ()
    {
        EnterpriseDT.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    });

    /* Se obtiene el listado de empresas y la estructura para ser agregadas a la tabla */

    var Enterprises = self.GetEnterprises();

    $(Enterprises).find('Enterprise').each(function ()
    {
        var Enterprise = $(this);

        var IdEnterprise = $(this).find('IdEmpresa').text();
        var EnterpriseKey = $(this).find('ClaveEmpresa').text();
        var EnterpriseName = $(this).find('NombreEmpresa').text();

        var data = [EnterpriseKey, EnterpriseName];

        /* Campos definidos por el usuario */
        $(EnterpriseStructure).find('Campo').each(function ()
        {
            var FieldName = $(this).find('name').text();
            var FieldType = $(this).find('type').text();
            var FieldLength = $(this).find('long').text();
            var RequiredField = $(this).find('required').text();
            var FieldValue = $(Enterprise).find(FieldName).text();

            var ColumnIndex = $(this).attr('index');

            data[ColumnIndex] = [FieldValue];
        });

        var ai = EnterpriseDT.row.add(data).draw();
        var n = EnterprisedT.fnSettings().aoData[ ai[0] ].nTr;
        n.setAttribute('id', IdEnterprise);

    });

    EnterprisedT.$('tbody tr:first').click();

    $('#IconWaitingEnterprises').remove();
};



ClassEnterprise.prototype.GetEnterprises = function ()
{
    var RepositoriesXml = 0;
    var data = {option: "GetEnterprises", DataBaseName: EnvironmentData.DataBaseName, IdUser: EnvironmentData.IdUsuario, UserName: EnvironmentData.NombreUsuario};
    $.ajax({
        async: false,
        cache: false,
        dataType: "html",
        type: 'POST',
        url: "php/Enterprise.php",
        data: data,
        success: function (xml)
        {
            if ($.parseXML(xml) === null) {
                Error(xml);
                return 0;
            } else
                xml = $.parseXML(xml);

            RepositoriesXml = xml;

            $(xml).find("Error").each(function ()
            {
                var $Error = $(this);
                var estado = $Error.find("Estado").text();
                var mensaje = $Error.find("Mensaje").text();
                Error(mensaje);
            });

        },
        beforeSend: function () {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Error(textStatus + "<br>" + errorThrown);
        }
    });

    return RepositoriesXml;
};