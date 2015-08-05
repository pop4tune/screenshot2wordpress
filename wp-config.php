<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link https://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'fundamit_wo0805');

/** MySQL database username */
define('DB_USER', 'fundamit_wo0805');

/** MySQL database password */
define('DB_PASSWORD', 'LyFt1q7HEQug');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'jl!+HTLEWj|nS*GLSJ|%/DcmAH@Lh?Sl=Zehqt=SK)uMd/ekhOf_}ok___{D)*+*-kNxZQJFX?uiCXya*vcWw$*C<g[M;$d-+}=>nEYng%(x&nbR{M@>+hH%Dk%oJ|Ji');
define('SECURE_AUTH_KEY', '{^XvTvEw%c{-g?$}sJY%F+H}>bArfA/_Eq]&L/%$Y<TrDCf>]D}NWmC{?HI%$ElJg](E?JFe)l*DEv=VK|tg!ZF*Iwv)sWY;ZmIvA$Khp_%GF;?|?z+M-e}jxO}nE>_k');
define('LOGGED_IN_KEY', 'ZpQVBslY/$(nvrNpOE/ldslS?s-zF/=G/ktGL>>x@[FO(-Anba}gqNX(ULRpBLhVn(*()neJihpZ>?!pI^m{C;laH&sHPDmPo(qEMDfwNX?|AP<BF[m*wqa}^vC!wXHD');
define('NONCE_KEY', ';BgASIswrk!{cFttE!Ji[zd*GY+qQECdIQF+K{{F?%*B/@(sQIBmKabp(MiWp-$zirM}OsANdp]w&mveqo{?kP[hEXVVs^d*?ym/BQkglh%S^zZDEP_-Y)k{@CUvrb[W');
define('AUTH_SALT', 'S(ENX)+|frmHmsB|=yGSxCZqt%I_DLHt{Q$<USKv/eQ}WSx^-q?QuWORm<]uQ_zqQ?ZYWL=qhl^FKiRDe^A-eJ+HUmJcojlpxP(c=Ejc{aqzD)j$bFs*F_vT}%tTGdBq');
define('SECURE_AUTH_SALT', '[r|__)kC}Le;lF@|TWL+bh=+TsRDwV)jC}EwCd?%lYx$O|%*zG(virE!E)GVv/WY$Hz{*)z--RbAzL|OtB;qQ/TCNS[Xkb*/MO-xEBC|pR]fX$l/OY(A(@|BedtPYbQ>');
define('LOGGED_IN_SALT', 'Cf$-e-sXLGBPzwNrIUcvaur|<j;NzwPgv)%*kARrGR}Nw*X{x[u]Z(fWPMKm)(tuUWjA%K;{XhBzOE_uqrYWppLPq@bv;+p(WAx$>n%rWvqSXz/frx$ScFL%qIAm;eHg');
define('NONCE_SALT', '/eZH;f&=TG^gVaEa_f[peKltouGcLgYALjUBY+BYDJjSe(MHny>J&aB${cDlSN*]<PCLGsA?AGvvWbN+>uO>h;bv_Qf/Jm<UQH+r[>+S)umDHy<FdF(yY%Eydw/*HX[J');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_jncg_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

/**
 * Include tweaks requested by hosting providers.  You can safely
 * remove either the file or comment out the lines below to get
 * to a vanilla state.
 */
if (file_exists(ABSPATH . 'hosting_provider_filters.php')) {
	include('hosting_provider_filters.php');
}
