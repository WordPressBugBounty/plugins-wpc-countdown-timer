<?php
defined( 'ABSPATH' ) || exit;

register_activation_hook( defined( 'WOOCT_LITE' ) ? WOOCT_LITE : WOOCT_FILE, 'wooct_activate' );
register_deactivation_hook( defined( 'WOOCT_LITE' ) ? WOOCT_LITE : WOOCT_FILE, 'wooct_deactivate' );
add_action( 'admin_init', 'wooct_check_version' );

function wooct_check_version() {
	if ( ! empty( get_option( 'wooct_version' ) ) && ( get_option( 'wooct_version' ) < WOOCT_VERSION ) ) {
		wpc_log( 'wooct', 'upgraded' );
		update_option( 'wooct_version', WOOCT_VERSION, false );
	}
}

function wooct_activate() {
	wpc_log( 'wooct', 'installed' );
	update_option( 'wooct_version', WOOCT_VERSION, false );
}

function wooct_deactivate() {
	wpc_log( 'wooct', 'deactivated' );
}

if ( ! function_exists( 'wpc_log' ) ) {
	function wpc_log( $prefix, $action ) {
		$logs = get_option( 'wpc_logs', [] );
		$user = wp_get_current_user();

		if ( ! isset( $logs[ $prefix ] ) ) {
			$logs[ $prefix ] = [];
		}

		$logs[ $prefix ][] = [
			'time'   => current_time( 'mysql' ),
			'user'   => $user->display_name . ' (ID: ' . $user->ID . ')',
			'action' => $action
		];

		update_option( 'wpc_logs', $logs, false );
	}
}