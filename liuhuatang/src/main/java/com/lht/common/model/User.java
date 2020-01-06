package com.lht.common.model;

import com.jfinal.plugin.activerecord.Model;

public class User  extends Model<User>  {

	//User.dao.findByIdLoadColumns (25).set("name", "James").update();
	public static User  dao= new User();

	public User getByKey(String key) {
		
		return dao.findFirst("select * from sl_channel c where c.channel_key=? and sys_company_code=? ",key, "");
	}
}
