//Hide the collapse menu when click to anywhere else
$(function (){ //same as document.addEventListener("DOMContentLoaded")...
   
    $(".navbar-toggler").blur(function(event){ //same as documnet.querySelector(".navbar-toggler").addEventListener("blur", function()...)
        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#collapsable-nav").collapse("hide"); //base on jquery
        }
    });
});


//SPA, mean the frame is keep, the body loaded dynamicaly, and not load a whole new page when click
//based on ajax

(function (global) {
    var dc = {};
    var homeHtmlUrl = "/Coursera_HTML_CSS_JS/snippets/home-snippet.html";
    var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "/Coursera_HTML_CSS_JS/snippets/category-title-snippet.html";
    var categoryHtml = "/Coursera_HTML_CSS_JS/snippets/category-snippet.html";
    var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "/Coursera_HTML_CSS_JS/snippets/menu-items-title.html";
    var menuItemHtml = "/Coursera_HTML_CSS_JS/snippets/menu-item.html";

    //Convinience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    //show loading icon inside element identified by 'selector'
    var showLoading = function (selector) {
        var html = "<div class = 'text-center'>";
        html += "<img src='https://github.com/jhu-ep-coursera/fullstack-course4/blob/master/examples/Lecture60/after/images/ajax-loader.gif?raw=true'>";
        insertHtml(selector, html);
    };

    //Return subsitute of {{propName}} with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    }

    //Remove the class 'actice' from hoem and swwitch to Menu button
    var switchMenuToActive = function () {
        //remove 'active' from home button
        var classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp ("active", "g"), "");
        document.querySelector("#navHomeButton").className = classes;

        //add 'active' to menu button if not already there
        classes = document.querySelector("#navMenuButton").className;
        if (classes.indexOf("active") == -1){
            classes += ActiveXObject;
            document.querySelector("#navMenuButton").className = classes;
        }
    };

    //On page load (before images or css)
    document.addEventListener("DOMContentLoaded", function (event) {

        //On first load, show home view
        showLoading("#main-content");
        // $ajaxUtils.sendGetRequest(homeHtml, 
        //     function (responseText){
        //         document.querySelector("#main-content").innerHTML = responseText;
        //     }, 
        //     false);

        // Build special area in homepage by choose random category
        $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowHomeHTML, true); 

        //Load the menu categories view
        dc.loadMenuCategories = function () {
            showLoading("#main-content");
            $ajaxUtils.sendGetRequest (allCategoriesUrl, buildAndShowCategoriesHTML);
        };

        //Load menu items view
        dc.loadMenuItems = function(categoryShort) {
            showLoading("#main-content");
            $ajaxUtils.sendGetRequest (menuItemsUrl + categoryShort, buildAndShowMenuItemsHTML);
        };
    });

    //Build HTML for the homepage based on categories array returned from the server
    function buildAndShowHomeHTML (categories) {
        //Load home snippet page
        $ajaxUtils.sendGetRequest(homeHtmlUrl, 
            function(homeHtml){
                categories = chooseRandomCategories(allCategoriesUrl);
                var choosenCategoryShortName = categories.short_name;
                choosenCategoryShortName = "'" + choosenCategoryShortName + "'";
                var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, "randomCategoryShortName", choosenCategoryShortName);
                insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
            },
            false);
    }

    // Given array of category objects, returns a random category object.
    function chooseRandomCategories (categories) {
        // Choose a random index into the array (from 0 inclusively until array length (exclusively))
        var randomArrayIndex = Math.floor(Math.random() * categories.length);
    
        // return category object with that randomArrayIndex
        return categories[randomArrayIndex];
    }

    //Build HTML for the categories page based on the data from the server
    function buildAndShowCategoriesHTML (categories) {
        //Load title snippet of categories page
        $ajaxUtils.sendGetRequest (categoriesTitleHtml, 
            function (categoriesTitleHtml){
                // Retrieve single category snippet
                $ajaxUtils.sendGetRequest(categoryHtml, 
                    function (categoryHtml) {
                        var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
                        insertHtml("#main-content", categoriesViewHtml)
                    }, 
                    false);
                },
            false);
    }

    // Using categories data and snippets html build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        // Loop over categories
        for (var i = 0; i < categories.length; i++) {
            // Insert category values
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    //Build HTML for the single category page based on the data from the server
    function buildAndShowMenuItemsHTML (categoryMenuItems) {
        $ajaxUtils.sendGetRequest (menuItemsTitleHtml, 
            function(menuItemsTitleHtml){
                //Retrieve single menu item snippet
                $ajaxUtils.sendGetRequest(menuItemHtml, 
                    function(menuItemHtml) {
                        var menuItemsViewHtml = buildMenuItemsViewHtml (categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
                        insertHtml("#main-content", menuItemsViewHtml);
                    },
                    false);
            }, 
            false);
    }

    // Using category and menu idems data and snippets html build menu items view HTML to be inserted into page
    function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
        menuItemsTitleHtml = insertProperty (menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";

        // Loop over menu items
        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for (var i = 0; i < menuItems.length; i++) {
            // Insert menu item values
            var html = menuItemHtml;
            html = insertProperty(html, "short_name",menuItems[i].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertItemPrice(html, "price_small", menuItems[i].price_small);
            html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
            html = insertItemPrice(html, "price_large", menuItems[i].price_large);
            html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
            html = insertProperty(html, "name", menuItems[i].name);
            html = insertProperty(html, "description", menuItems[i].description);

            //Add clearfix after every second menu item
            if (i % 2 != 0) {
                html += "<div class clearfix d-none d-lg-block d-md-block></div>";
            }

            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    //insertItemPrice
    function insertItemPrice (html, pricePropName, priceValue) {
        if (!priceValue) {
            return insertProperty(html, pricePropName, "");
        }
        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }

    //insertItemPortionName
    function insertItemPortionName (html, portionPropName, portionValue) {
        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }
        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }

    global.$dc = dc;
})(window);
