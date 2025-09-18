/*
	Directive by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			wide:      [ '1281px',  '1680px' ],
			normal:    [ '981px',   '1280px' ],
			narrow:    [ '841px',   '980px'  ],
			narrower:  [ '737px',   '840px'  ],
			mobile:    [ '481px',   '736px'  ],
			mobilep:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Mobile navigation toggle
	$(document).ready(function() {
		var $navToggle = $('#navToggle');
		var $navMenu = $('#navMenu');
		
		// Check if we're on a mobile device
		function isMobile() {
			return window.matchMedia('(max-width: 840px)').matches;
		}
		
		// Toggle mobile menu
		$navToggle.on('click', function(e) {
			e.stopPropagation();
			$navMenu.toggleClass('active');
			$body.toggleClass('nav-open');
		});
		
		// Close mobile menu when clicking on a link
		$('.nav-link').on('click', function() {
			if (isMobile()) {
				$navMenu.removeClass('active');
				$body.removeClass('nav-open');
			}
		});
		
		// Close menu when clicking outside
		$(document).on('click', function(e) {
			if ($navMenu.hasClass('active') && !$(e.target).closest('.nav-menu').length && !$(e.target).is('.nav-toggle')) {
				$navMenu.removeClass('active');
				$body.removeClass('nav-open');
			}
		});
		
		// Smooth scrolling for navigation links with hash
		$('a[href^="#"]').on('click', function(e) {
			// Close mobile menu if open
			if (isMobile()) {
				$navMenu.removeClass('active');
				$body.removeClass('nav-open');
			}
			
			// Only handle internal anchor links
			var target = $(this).attr('href');
			if (target !== '#' && target.startsWith('#')) {
				e.preventDefault();
				
				// Check if target element exists
				var $target = $(target);
				if ($target.length) {
					$('html, body').animate({
						scrollTop: $target.offset().top - 70 // Adjust for fixed header
					}, 800);
				}
			}
		});
		
		// Handle window resize
		$window.on('resize', function() {
			if (!isMobile()) {
				$navMenu.removeClass('active');
				$body.removeClass('nav-open');
			}
		});
		
		// Prevent clicks inside menu from closing it
		$navMenu.on('click', function(e) {
			e.stopPropagation();
		});
	});

})(jQuery);