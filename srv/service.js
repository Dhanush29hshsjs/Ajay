const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    /* SERVICE ENTITIES */
    let {
        Groups,
        Members,
        Roles,
        Shelp_member
    }=this.entities;

    const c4re = await cds.connect.to('iflow');

    /* SERVICE HANDLERS */

    //-------------------------------------------------------------------------------------------
    // Get data into Groups tab
    var read = true;
    this.before('READ', Groups, async (req) => {
        try {
            if (read) {
                const resp = await c4re.get('/group');
                // cds.tx(req).run(DELETE(Groups));
                // cds.tx(req).run(DELETE(Members));
                const spaces = resp.body.Group;
                const mem_data = [];
                const g_data=[];
                spaces.forEach(space => {
                    const spacec = space.members;

                    spacec.forEach(mb =>{
                        mem_data.push({
                            member_id: mb.member_id,
                            member_name: `${mb.member_name || ' ' }`,
                            email: `${mb.email || ' '}`,
                            group_id: `${mb.group_id || ' '}`,
                            position: `${mb.position || ' '}`,
                            p_image: `${mb.profile_photo || ' '}`,
                        });
                    })

                    g_data.push({
                        member_id: space.member_id,
                        group_id: `${space.group_id || ' '}`,
                        description: `${space.description || ' '}`,
                        is_valid: `${space.is_valid || ' '}`,
                        member_count: `${space.member_count || ' '}`,
                        name: `${space.name || ' '}`
                    })

                });
                await cds.tx(req).run(INSERT.into(Groups).entries(g_data));
                await cds.tx(req).run(INSERT.into(Members).entries(mem_data));

                // getting search help roles 
                const resp1 = await c4re.get('/dropdown?drop_key=user_type');
                const r_data = resp1.body;
                var role = [];
                r_data.forEach(row =>{
                    role.push({
                        drop_key:row.drop_key, 
                        table_key: row.table_key,
                        value2: row.value2,
                    })
                })
                await cds.tx(req).run(INSERT.into(Roles).entries(role));

                // getting search help members
                var members = [];
                for(i = 0;i< r_data.length;i++){
                  var role_tk = r_data[i].table_key;
                  const resp2 = await c4re.get(`/member?search_string=&role=${role_tk}`);
                  const m_data = resp2.body.Member; 
                  m_data.forEach(mb => {
                    members.push({
                      member_id: mb.member_id,
                      member_name: `${mb.fs_name} ${mb.ls_name}`,
                      email: `${mb.email || ' '}`,
                      position: `${mb.position || ' '}`,
                    });
                  });
                }
                await cds.tx(req).run(INSERT.into(Shelp_member).entries(members));

                read = false;
            }
            return req;
        } catch (err) {
            req.error(500, err.message);
        }
    });
  
     // //--------------------------------------------------------
    // new Group validation
    this.before("POST", "Groups", async (req) => {
        const roles_data = await SELECT.from(Roles);
        try {
           let group_data=req.data;
           const g_role =req.data.role;
           const m_id =[];
           const  mem_list=req.data.members;
           if(mem_list.length>0){
            mem_list.forEach(mem =>{
              if(g_role != mem.position){
                req.error({
                  message: mem.member_name+'(Member) Position "'+mem.position+'" is IRRELATIVE to this Group`s Role "'+g_role+'".',
                  code: 'IRRELATIVE_ROLE'
              });
              }
            });
            roles_data.forEach(role =>{
              if(role.value2 === g_role){
                req.data.role = role.table_key;
              }
            })
            req.data.is_valid = 'y';
           }else{
            req.error({
              message: '"Group" should contain atleast one "Member"',
              code: 'IRRELATIVE_ROLE'
          });
           }

           debugger
        } catch (err) {
            req.error(500, err.message);
        }
    });



    // new Group
    this.on('POST', Groups, async (req) => {
      var mem_list = [];
      mem_list = req.data.members;
      var m_id=[];
      mem_list.forEach(mem =>{
        m_id.push(mem.member_id);
      })

       var body ={
        name: req.data.name,
        description: req.data.description,
        role: req.data.role,
        member_ids: m_id,
    }
        try {
          debugger
          resp = await c4re.post('/group', body); 
          const createEntity = await INSERT.into(Groups).entries(req.data);
          if(statuscode = 200){
            const g_id = req.data.group_id;
          const membersPromises = mem_list.map(async (memberData) => {
            cds.tx(req).run(DELETE(Members).where({ member_id : memberData.member_id }));
            const newMember = {
                ...memberData,
                group_id: g_id, // Set the group_id for the member
            };
            await INSERT.into(Members).entries(newMember);
        });
        await Promise.all(membersPromises);

          return req.data;
          }else{
            req.error({
              message: 'Internal error while creating "Group"',
              code: 'GROUP_NOT_CREATED'
            })
          }
        } catch (err) {
            req.error(500, err.message);
        }
    });

    // //--------------------------------------------------------
    // // update Gruop
    this.on('UPDATE', Groups, async (req) => {
      debugger
      var mem_list = [];
      mem_list = req.data.members;

      var m_id=[];
      mem_list.forEach(mem =>{
        m_id.push(mem.member_id);
      })

      const groupId = req.params[0].group_id;

       var body ={
        name: req.data.name,
        description: req.data.description,
        role: req.data.role,
        is_valid: "y",
        member_ids: m_id,
    }
        try {
          debugger
          resp = await c4re.patch(`/group?group_id=${groupId}`, body);
          if(statuscode = 200){
          await UPDATE(Groups).set(req.data).where({ group_id: groupId });
           await DELETE.from(Members).where({ group_id: groupId });
          
          const membersPromises = mem_list.map(async (memberData) => {
            cds.tx(req).run(DELETE(Members).where({ member_id : memberData.member_id }));
            const newMember = {
                ...memberData,
                group_id: groupId, // Set the group_id for the member
            };
            await INSERT.into(Members).entries(newMember);
        });
        await Promise.all(membersPromises);
        return req.data;
          }else{
            req.error({
              message: 'Internal error while updating "Group"',
              code: 'GROUP_NOT_UPDATED'
            })
          } 
          
        } catch (err) {
            req.error(500, err.message);
        }
    });


    // //--------------------------------------------------------
    // // delete Group
  this.on('DELETE', Groups, async (req) => {
      debugger
      const groupId = req.params[0].group_id;
      try {
          resp = await c4re.delete(`/group?group_id=${groupId}`);
          if(resp.statuscode == 200){
          await DELETE.from(Groups).where({ group_id: groupId });
          await DELETE.from(Members).where({ group_id: groupId });

          return { success: true, message: `Group ${groupId} and its members deleted successfully` };
          }else{
            req.error({
              message: 'Internal error while deleting "Group"',
              code: 'GROUP_NOT_UPDATED'
            })
          }
      } catch (err) {
          return req.error(500, 'Internal Server Error');
      }
  });

   


   
    
});