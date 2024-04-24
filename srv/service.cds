using Application from '../db/schema';



service ApplicationService {
    @odata.draft.enabled
    entity Groups as projection on Application.Groups;

    entity Members as projection on Application.Members;

    entity Roles as projection on Application.Roles;

    entity Shelp_member as projection on Application.Shelp_member;

};


    
