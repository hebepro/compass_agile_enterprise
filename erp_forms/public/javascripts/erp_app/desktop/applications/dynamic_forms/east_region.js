Ext.define("Compass.ErpApp.Desktop.Applications.DynamicForms.EastRegion",{
    extend:"Ext.tab.Panel",
    alias:'widget.dynamic_forms_east_region',
    itemId: 'east_tabs',
    header: false,
    activeTab: 0,
    style: 'border-radius: 5px;',
    height: 500,
    defaults:{
        width: 255
    },

    items: [
        {
            xtype: 'form',
            title: 'Field Properties',
            itemId: 'field_props',
            autoScroll: true,
            bodyPadding: 10,
            tbar: [
                { xtype: 'button',
                    text: 'Update Field',
                    iconCls: 'icon-edit',

                    listeners:{
                        click: function(button){
                            // get formPanel
                            var updateFieldForm = button.findParentByType('form').getForm();
                            if (updateFieldForm.isValid()){
                                var formPanel = Ext.getCmp('formBuilder_'+config.title).query('#dynamicForm').first();
                                var formBuilder = formPanel.findParentByType('dynamic_forms_FormBuilder');
                                var selected_field = formPanel.selected_field;
                                var updateName = updateFieldForm.findField('updateName').getValue();

                                // build field json
                                var fieldDefinition = {
                                    xtype: (selected_field.field_xtype == 'hiddenfield' ? 'hiddenfield' : selected_field.xtype),
                                    name: updateName,
                                    fieldLabel: updateFieldForm.findField('updateLabel').getValue()
                                };
                                if (selected_field.field_xtype == 'hiddenfield'){
                                    try { var updateHideMode = updateFieldForm.findField('updateHideMode').getValue();
                                        if (!Ext.isEmpty(updateHideMode)) fieldDefinition.hideMode = updateHideMode; } catch(e){}
                                }
                                try { fieldDefinition.labelAlign = updateFieldForm.findField('updateLabelAlign').getValue(); } catch(e){}
                                try { fieldDefinition.readOnly = updateFieldForm.findField('updateReadOnly').getValue(); } catch(e){}
                                try { fieldDefinition.hideTrigger = updateFieldForm.findField('updateHideTrigger').getValue(); } catch(e){}
                                try { var updateEmptyText = updateFieldForm.findField('updateEmptyText').getValue();
                                    if (!Ext.isEmpty(updateEmptyText)) fieldDefinition.emptyText = updateEmptyText; } catch(e){}
                                try { var updateHelpQtip = updateFieldForm.findField('updateHelpQtip').getValue();
                                    if (!Ext.isEmpty(updateHelpQtip)) fieldDefinition.help_qtip = updateHelpQtip; } catch(e){}

                                try { fieldDefinition.allowBlank = updateFieldForm.findField('updateAllowBlank').getValue(); } catch(e){}
                                try { fieldDefinition.display_in_grid = updateFieldForm.findField('updateDisplayInGrid').getValue(); } catch(e){}
                                try { fieldDefinition.searchable = updateFieldForm.findField('updateSearchable').getValue(); } catch(e){}
                                try { var updateValue = updateFieldForm.findField('updateValue').getValue();
                                    if (selected_field.xtype == 'related_combobox' || selected_field.xtype == 'related_searchbox') {
                                        if (!Ext.isEmpty(updateValue)) fieldDefinition.default_value = parseInt(updateValue, 10);
                                    }else{
                                        if (!Ext.isEmpty(updateValue)) fieldDefinition.value = updateValue;
                                    }
                                } catch(e){}
                                try { var updateLabelWidth = updateFieldForm.findField('updateLabelWidth').getValue();
                                    if (!Ext.isEmpty(updateLabelWidth)) fieldDefinition.labelWidth = updateLabelWidth; } catch(e){}
                                try { var updateWidth = updateFieldForm.findField('updateWidth').getValue();
                                    if (!Ext.isEmpty(updateWidth)) fieldDefinition.width = updateWidth; } catch(e){}
                                try { var updateHeight = updateFieldForm.findField('updateHeight').getValue();
                                    if (!Ext.isEmpty(updateHeight)) fieldDefinition.height = updateHeight; } catch(e){}

                                if (Ext.isEmpty(selected_field.field_xtype) && Ext.Array.indexOf(['related_combobox','related_searchbox','combobox','combo'], selected_field.xtype) < 0){
                                    switch(updateFieldForm.findField('updateValidationType').getValue()){
                                        case 'regex':
                                            var validationRegex = updateFieldForm.findField('updateValidationRegex').getValue();
                                            if(!Ext.isEmpty(validationRegex)) fieldDefinition.validation_regex = validationRegex;
                                            fieldDefinition.regexText = updateFieldForm.findField('updateValidationRegexText').getValue();
                                            break;
                                        case 'function':
                                            fieldDefinition.validator_function = updateFieldForm.findField('updateValidationFunction').getValue();
                                            break;
                                        case 'vtype':
                                            fieldDefinition.vtype = updateFieldForm.findField('updateValidationVType').getValue();
                                            break;
                                        default:
                                    }
                                }

                                if (selected_field.xtype == 'datefield' || selected_field.xtype == 'timefield' || selected_field.xtype == 'numberfield'){
                                    var updateMinValue = updateFieldForm.findField('updateMinValue').getValue();
                                    var updateMaxValue = updateFieldForm.findField('updateMaxValue').getValue();
                                    if(!Ext.isEmpty(updateMinValue)) fieldDefinition.minValue = updateMinValue;
                                    if(!Ext.isEmpty(updateMaxValue)) fieldDefinition.maxValue = updateMaxValue;
                                }

                                if (selected_field.xtype == 'textfield' || selected_field.xtype == 'textarea' || selected_field.xtype == 'numberfield'){
                                    var updateMinLength = updateFieldForm.findField('updateMinLength').getValue();
                                    var updateMaxLength = updateFieldForm.findField('updateMaxLength').getValue();
                                    if(!Ext.isEmpty(updateMinLength)) fieldDefinition.minLength = updateMinLength;
                                    if(!Ext.isEmpty(updateMaxLength)) fieldDefinition.maxLength = updateMaxLength;
                                }

                                if (selected_field.xtype == 'filefield'){
                                    fieldDefinition.buttonText = updateFieldForm.findField('updateButtonText').getValue();
                                    fieldDefinition.vtype = 'file';
                                    // fieldDefinition.inputType = 'file'; // needed for fileSize validation but it causes some cosmetic problems
                                    // fieldDefinition.buttonConfig = {hidden: true};
                                }

                                if (selected_field.xtype == 'related_combobox' || selected_field.xtype == 'related_searchbox'){
                                    fieldDefinition.editable = updateFieldForm.findField('updateEditable').getValue();
                                    fieldDefinition.forceSelection = updateFieldForm.findField('updateForceSelection').getValue();
                                    fieldDefinition.multiSelect = updateFieldForm.findField('updateMultiSelect').getValue();
                                    fieldDefinition.extraParams = {
                                        model: updateFieldForm.findField('updateRelatedModel').getValue()
                                    };
                                    if (selected_field.xtype == 'related_combobox'){
                                        fieldDefinition.displayField = updateFieldForm.findField('updateDisplayField').getValue();
                                        fieldDefinition.fields = [
                                            { name: 'id' },
                                            { name: fieldDefinition.displayField }
                                        ];
                                        fieldDefinition.extraParams.displayField = fieldDefinition.displayField;
                                    }else if (selected_field.xtype == 'related_searchbox'){
                                        fieldDefinition.search_fields = updateFieldForm.findField('updateSearchFields').getValue().replace(/\s/g,'');
                                        fieldDefinition.display_fields = updateFieldForm.findField('updateDisplayFields').getValue().replace(/\s/g,'');
                                        fieldDefinition.display_template = updateFieldForm.findField('updateDisplayTemplate').getValue();
                                        //fieldDefinition.typeAhead = updateFieldForm.findField('updateTypeAhead').getValue();
                                        fieldDefinition.pageSize = updateFieldForm.findField('updatePageSize').getValue();
                                        fieldDefinition.fields = [{ name: 'id' }];
                                        Ext.each(fieldDefinition.display_fields.split(','), function(f){
                                            fieldDefinition.fields.push({ name: f });
                                        });
                                        fieldDefinition.extraParams.search_fields = fieldDefinition.search_fields;
                                        fieldDefinition.extraParams.display_fields = fieldDefinition.display_fields;
                                    }
                                }else if (selected_field.xtype == 'combobox' || selected_field.xtype == 'combo'){
                                    var updateOptions = updateFieldForm.findField('updateOptions').getValue();
                                    if(updateOptions){
                                        var options = updateOptions.split(',');
                                        var optionsArray = [], subArray = [], i = 1;
                                        Ext.each(options, function(option){
                                            subArray.push(option.trim());
                                            if (i%2 === 0){
                                                optionsArray.push(subArray);
                                                subArray = [];
                                            }
                                            i++;
                                        });

                                        fieldDefinition.store = optionsArray;
                                    }
                                    fieldDefinition.editable = updateFieldForm.findField('updateEditable').getValue();
                                    fieldDefinition.forceSelection = updateFieldForm.findField('updateForceSelection').getValue();
                                    fieldDefinition.multiSelect = updateFieldForm.findField('updateMultiSelect').getValue();
                                }

                                //console.log(fieldDefinition);

                                // use getIndexOfFieldByName and splice to replace field in definition to preserve field order
                                var indexOfField = formBuilder.getIndexOfFieldByName(formPanel, formPanel.selected_field.name);
                                //console.log(indexOfField);

                                formPanel.form_definition.splice(indexOfField, 1, fieldDefinition);
                                //console.log(formPanel.form_definition);

                                // reload form from definition
                                formBuilder.reloadForm(formPanel);

                                // re-highlight form item
                                formPanel.getForm().findField(updateName).getEl().dom.click();
                            }
                        }
                    }
                }
            ],
            defaults:{
                width: 230,
                labelWidth: 85
            },
            items:[]
        },
        {
            xtype: 'form',
            title: 'Form Properties',
            itemId: 'form_props',
            autoScroll: true,
            bodyPadding: 10,
            defaults:{
                width: 230,
                labelWidth: 85
            },
            items:[{
                fieldLabel: 'Form Title',
                name: 'description',
                xtype: 'textfield',
                allowBlank: false
            },
                {
                    fieldLabel: 'Internal ID',
                    name: 'internal_identifier',
                    xtype: 'displayfield'
                },
                {
                    fieldLabel: 'Widget Action',
                    name: 'widget_action',
                    xtype: 'combobox',
                    width: 215,
                    allowBlank: false,
                    forceSelection:true,
                    store: [
                        ['email', 'Email Only'],
                        ['save', 'Save Only'],
                        ['both', 'Email & Save Data']
                    ],
                    listeners:{
                        change:function(field, newValue, oldValue){
                            var widget_email_recipients = field.findParentByType('form').getForm().findField('widget_email_recipients');
                            widget_email_recipients.allowBlank = (field.getValue() == 'save');
                        }
                    },
                    plugins: [new helpQtip("Configure the action to be taken when a form is submitted via Knitkit's Dynamic Forms Widget.<br /> Email Only will email but not save the data to the database.<br /> Save Only will save the data to the database but not email.<br /> Email & Save Data will do both.<br /> NOTE: The Contact Us Widget uses Knitkit's website configuration options for email behavior & not the Dynamic Forms Widget Action setting.")]
                },
                {
                    fieldLabel: 'Email Recipients',
                    name: 'widget_email_recipients',
                    xtype: 'textfield',
                    vtype: 'emailList',
                    width: 215,
                    listeners:{
                        render:function(field){
                            field.allowBlank = (field.findParentByType('form').getForm().findField('widget_action').getValue() == 'save');
                        }
                    },
                    plugins: [new helpQtip('When Widget Action is set to Email only or Email & Save Data, this field is required. Enter a comma separated list of email addresses to receive data submitted with this form via the Knitkit Dynamic Forms widget.')]
                },
                {
                    fieldLabel: 'Focus Field',
                    name: 'focus_first_field',
                    xtype: 'checkbox',
                    width: 105,
                    plugins: [new helpQtip('Do you want the cursor to autmatically focus the first form field? If there is text it will also automatically highlight.')]
                },
                {
                    fieldLabel: 'Submit Button Label',
                    name: 'submit_button_label',
                    xtype: 'textfield',
                    allowBlank: false
                },
                {
                    fieldLabel: 'Cancel Button Label',
                    name: 'cancel_button_label',
                    xtype: 'textfield',
                    allowBlank: false
                },
                {
                    fieldLabel: 'Submit Empty Text',
                    name: 'submit_empty_text',
                    xtype: 'checkbox',
                    width: 105,
                    plugins: [new helpQtip('Empty Text is example text. Do you want to submit these example values if they are unchanged by the user?')]
                },
                {
                    fieldLabel: 'Message Target',
                    name: 'msg_target',
                    xtype: 'combobox',
                    allowBlank: false,
                    editable: true,
                    forceSelection:false,
                    value: 'qtip',
                    store: [
                        ['qtip', 'Quick Tip'],
                        ['side', 'Right of Field'],
                        ['title', 'Title'],
                        ['under', 'Under Field'],
                        ['none', 'None']
                    ]
                },
                {
                    fieldLabel: 'Comment',
                    labelAlign: 'top',
                    name: 'comment',
                    xtype: 'textarea'
                },
                {
                    fieldLabel: 'Created At',
                    name: 'created_at',
                    xtype: 'displayfield'
                },
                {
                    fieldLabel: 'Created By',
                    name: 'created_by',
                    xtype: 'displayfield'
                },
                {
                    fieldLabel: 'Updated At',
                    name: 'updated_at',
                    xtype: 'displayfield'
                },
                {
                    fieldLabel: 'Updated By',
                    name: 'updated_by',
                    xtype: 'displayfield'
                }
            ]
        }
    ]
});
