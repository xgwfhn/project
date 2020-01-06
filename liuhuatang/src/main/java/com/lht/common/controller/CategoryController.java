package com.lht.common.controller;

import com.jfinal.core.Controller;

public class CategoryController extends Controller {

	public void index() {
		renderText("此方法是一个action");
		render("category1.html");
	}

	public void search() {
		render ("search.html"); 
	}
	
	public void searchResult() {
		render ("searchResult.html"); 
	}
}
