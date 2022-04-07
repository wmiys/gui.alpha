// https://preview.webpixels.io/quick-website-ui-kit/docs/components/dropdowns.html


export class Dropdown {
	constructor() {
		this.$dropdown = $('.dropdown-animate'),
			this.$dropdownSubmenu = $('.dropdown-submenu [data-toggle="dropdown"]');


		this.init = this.init.bind(this);
		this.hideDropdown = this.hideDropdown.bind(this);
		this.initSubmenu = this.initSubmenu.bind(this);
	}

    // all objects need to call this for it to work
	init() {
		const self = this;

		if (self.$dropdown.length) {
			self.$dropdown.on('hide.bs.dropdown', function (e) {
				self.hideDropdown($(this));
				// self.hideDropdown(this);
			});
		}

		if (self.$dropdownSubmenu.length) {
			self.$dropdownSubmenu.on('click', function (e) {
				self.initSubmenu($(this));
				// self.initSubmenu(this);
				return false;
			});
		}
	}

	initSubmenu(selector) {
		if (!selector.next().hasClass('show')) {
			selector.parents('.dropdown-menu').first().find('.show').removeClass("show");
		}

		var $submenu = selector.next(".dropdown-menu");

		$submenu.toggleClass('show');
		$submenu.parent().toggleClass('show');

		selector.parents('.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
			$('.dropdown-submenu .show').removeClass("show");
		});
	}


	hideDropdown(selector) {
		// Add additional .hide class for animated dropdown menus in order to apply some css behind

		var $dropdownMenu = selector.find('.dropdown-menu');
		$dropdownMenu.addClass('hide');

		setTimeout(function () {
			$dropdownMenu.removeClass('hide');
		}, 300);

	}


}