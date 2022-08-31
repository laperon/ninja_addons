let finder = {
    module_block: '.ninja-finder-module',
    find_button: '.wp-media-buttons',

    init: function () {
        finder.addButtonToTablesModal();
        finder.openModal();
        finder.initFindTemplate();
    },

    initFindTemplate: function () {
        var template = '<div class="ninja-finder-module">\n' +
            '    <div class="modal-content">\n' +
            '    <span class="close">&times;</span>\n' +
            '    <h3>Find a suggestion</h3>\n' +
            '    <form>\n' +
            '        <label for="tags">\n' +
            '            <input type="text" placeholder="Search..." class="search form-control">\n' +
            '        </label>\n' +
            '        <input class="button" type="submit" value="Find">\n' +
            '    </form>\n' +
            '    <div>\n' +
            '        <div class="status"></div>\n' +
            '        <ul class="results"></ul>\n' +
            '    </div>\n' +
            '   </div>\n'
        '</div>';

        jQuery( 'body' ).append( template );
    },

    addButtonToTablesModal: function () {
        var btn = '<button class="button" id="js-finder-module-button">Find block</button>';
           setTimeout(function () {
               jQuery( ".actions a, .el-button--primary" ).on( 'click', function () {
                   jQuery( finder.find_button ).append( btn );
                   finder.initModal();
               });
           }, 1000);

    },

    openModal: function () {
        jQuery( 'body' ).on( 'click', '#finder', function () {
            $( '.tablenav.top' ).modal( 'show' );
        });
    },

    initAjax: function ( item ) {
        jQuery.post( ajaxurl, {
            'action': 'ninja_finder_get_items',
            'search': item
        }, function () {
            finder.setAjaxStatus( 'Searching...' )
        }).done( function ( response ) {
            finder.responseCallback( response )
        });
    },

    setAjaxStatus: function ( status ) {
        jQuery( finder.module_block ).find( '.status' ).text( status );
    },

    responseCallback: function ( response ) {
        var data = JSON.parse( response );
        if ( data.length > 0 ) {
            var template = jQuery( finder.module_block );
            var list = '';

            for ( var i = 0; i < data.length; i++ ) {
                list += finder.createRow( data[i], i );
            }

            finder.createHtmlBlock( list );
            finder.copyInit();
            finder.setAjaxStatus('');
        } else {
            finder.setAjaxStatus( 'Noting found' );
            finder.createHtmlBlock( [] );
        }
    },

    createHtmlBlock: function ( list ) {
        jQuery( finder.module_block ).find( '.results' ).html( list );
    },

    createRow: function ( row, i ) {
        var button = finder.addCopyButton( row.post_content, i );
        var title  = ('<b>' + row.post_title  + '</b> | ' + row.post_content).slice( 0, 50 ) + '...';
        var row = '<li class="row-' + i + '">' + title + button + '</li>';
        return row;
    },

    addCopyButton: function ( content, i ) {
        var template = '<span data-content="' + content + '" data-index="' + i + '" class="copy">[Copy]</span>';
        return template;
    },

    copyInit: function () {
        jQuery( finder.module_block ).find('.copy').on('click', function () {
            var $this    = jQuery( this );
            var copyText = $this.data( 'content' );
            var status   = navigator.clipboard.writeText( copyText );
            if ( status ) {
                finder.changeCopyButtonStatus( $this );
            }
        });
    },

    changeCopyButtonStatus: function ( $this ) {
        $this.text( '[Copied]' );
    },

    submitInit: function () {
        jQuery( finder.module_block ).find( 'form' ).on( 'submit', function (e) {
            e.preventDefault();
            var search = jQuery( this ).find( '.search' ).val();
            finder.initAjax( search )
        })
    },

    initModal: function () {
        finder.openModal();
        finder.closeModal();
        finder.submitInit();
    },

    closeModal: function () {
        jQuery( '.ninja-finder-module .close' ).on( 'click', function (e) {
            e.preventDefault();
            jQuery( '.ninja-finder-module' ).hide();
        });
    },

    openModal: function () {
        jQuery( '#js-finder-module-button' ).on( 'click', function (e) {
            e.preventDefault();
            jQuery( '.ninja-finder-module' ).show();
        });
    }

}
jQuery(document).ready(function () {
    var checkExist = setInterval(function() {
        if ( jQuery('.el-table').length ) {
            clearInterval( checkExist );
            finder.init();
        }
    }, 100 );
});