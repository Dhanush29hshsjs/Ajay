namespace Application;

entity Groups
{
   key group_id : String;
    description : String;
    is_valid : String;
    member_count : String;
    name : String;
    role : String;
    members : Composition of many Members on members.group_id = group_id;
}

entity Members 
{
    key id : UUID;
    email : String;
    member_id : Integer;
    group_id : String;
    member_name : String;
    position : String;
    p_image : String @UI.IsImageURL;
    role : String;
    group : Association to one Groups on group.group_id = group_id;
}

entity Roles
{
    drop_key : String;
    key table_key : String;
    value2 : String;
}

entity Shelp_member
{
    key member_id : Integer;
    member_name : String;
    email : String;
    position : String;
}
