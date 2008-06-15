var Fireplazer = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
  },

  onMenuItemCommand: function() {
	toggleSidebar("viewBookmarksSidebar");
  }
};

window.addEventListener("load", function(e) { Fireplazer.onLoad(e); }, false); 
