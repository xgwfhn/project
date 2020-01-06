package com.lht.common.controller;

import com.jfinal.core.Controller;

public class IndexController extends Controller {

	public void index() {
		renderText("此方法是一个action");
		render("index.html");
	}

	public String test() {
		return "index.html"; 
	}
}
