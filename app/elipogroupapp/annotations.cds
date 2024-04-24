using ApplicationService as service from '../../srv/service';

annotate service.Groups with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Groups',
            Value : name,
            ![@UI.Importance] : #High,
        },
    ]
);
annotate service.Groups with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Description',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Role',
                Value : role,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Group Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'members',
            Target : 'members/@UI.LineItem#members',
            Label : 'Members',
        },
    ]
);
annotate service.Groups with {
    role @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Roles',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : role,
                    ValueListProperty : 'value2',
                },
            ],
            Label : 'roles help',
        },
        Common.ValueListWithFixedValues : true
)};
annotate service.Members with @(
    UI.LineItem #members : [
        {
            $Type : 'UI.DataField',
            Value : member_id,
            Label : 'member_id',
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Value : p_image,
            Label :'Profile',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : member_name,
            Label : 'Name',
            ![@UI.Importance] : #High,
        },{
            $Type : 'UI.DataField',
            Value : position,
            Label : 'Position',
        },{
            $Type : 'UI.DataField',
            Value : email,
            Label : 'Email',
        },
        ]
);
annotate service.Members with {
    member_name @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Shelp_member',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : member_name,
                    ValueListProperty : 'member_name',
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'member_id',
                    LocalDataProperty : member_id,
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'email',
                    LocalDataProperty : email,
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'position',
                    LocalDataProperty : position,
                },
            ],
            Label : 'Member help',
        },
        Common.ValueListWithFixedValues : true
)};
annotate service.Shelp_member with {
    member_name @Common.Text : position
};
annotate service.Members with {
    position @Common.FieldControl : #ReadOnly
};
annotate service.Members with {
    email @Common.FieldControl : #ReadOnly
};
annotate service.Groups with @(
    UI.HeaderInfo : {
        TypeName : 'Group',
        TypeNamePlural : '',
    }
);
