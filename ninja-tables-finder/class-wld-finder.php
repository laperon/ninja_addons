<?php

class Ninja_Finder {
	public function __construct() {
		add_action(
			'wp_ajax_ninja_finder_get_items',
			array( $this, 'ajax_get_items' )
		);
		add_action(
			'admin_enqueue_scripts',
			array( $this, 'init_scripts' )
		);
	}

	public function ajax_get_items() : void {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$search = $_POST['search'] ?? '';
		if ( ! empty( $search ) ) {
			$posts = new WP_Query(
				array(
					'post_type'      => 'table',
					'post_status'    => 'publish',
					'posts_per_page' => - 1,
					's'              => $search,
				)
			);

			echo wp_json_encode( $posts->posts );
		} else {
			echo wp_json_encode( [] );
		}
		die();
	}

	public function init_scripts() : void {
		$url = get_stylesheet_directory_uri();
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['page'] ) && 'ninja_tables' === $_GET['page'] ) {
			wp_enqueue_script(
				'wld-init',
				$url . '/inc/ninja-tables-finder/assets/js/init.js',
				array( 'jquery' ),
				WLD_VER,
				true
			);

			wp_enqueue_style(
				'wld-admin-finder',
				$url . '/inc/ninja-tables-finder/assets/css/style.css',
				array(),
				WLD_VER
			);
		}
	}
}

new Ninja_Finder();
