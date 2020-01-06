package com.lht.common.controller;

import com.jfinal.core.Controller;
import com.lht.common.util.CheckUtil;

public class WechatController extends Controller {

	// 公众号服务器调用唯一入口接入验证
	public void tokenCheck() {
		String signature = getPara("signature");
		String timestamp = getPara("timestamp");
		String nonce = getPara("nonce");
		String echostr = getPara("echostr");

		if (CheckUtil.checkSignature(signature, timestamp, nonce)) {
			if(echostr!=""&&echostr!=null) {
				renderText(echostr);
			}
			// render(echostr); 报错 为什么
		}
		// return "";
	}
}
