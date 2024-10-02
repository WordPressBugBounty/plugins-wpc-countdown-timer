'use strict';

(function($) {
  $(function() {
    wooct_color_picker();
    wooct_time_picker();
    wooct_time_type();
    wooct_active();
  });

  $('#woocommerce-product-data').
      on('woocommerce_variations_loaded woocommerce_variations_added',
          function() {
            wooct_color_picker();
            wooct_time_picker();
            wooct_time_type();
            wooct_active();
          });

  $(document).on('click touch', '.wooct_shortcode', function() {
    $(this).select();
  });

  $(document).
      on('change blur',
          '.wooct_shortcode_builder input, .wooct_shortcode_builder select',
          function() {
            wooct_build_shortcode();
            wooct_preview();
          });

  $(document).
      on('change blur', '#wooct_settings input, #wooct_settings select',
          function() {
            wooct_preview();
          });

  $(document).on('change', '.wooct_time', function() {
    wooct_time_type();
  });

  $(document).on('change', '.wooct_active', function() {
    wooct_active($(this).closest('.wooct_time_form'));
  });

  function wooct_time_picker() {
    $('.wooct_date_time').wpcdpk({
      timepicker: true,
    });

    $('.wooct_date').wpcdpk();

    $('.wooct_date_range').wpcdpk({
      range: true, multipleDatesSeparator: ' - ',
    });

    $('.wooct_date_multi').wpcdpk({
      multipleDates: 5, multipleDatesSeparator: ', ',
    });

    $('.wooct_time').wpcdpk({
      dateFormat: ' ', timepicker: true, classes: 'only-time',
    });
  }

  function wooct_color_picker() {
    $('.wooct_color').wpColorPicker({
      change: function(event, ui) {
        //console.log($(this).wpColorPicker('color'));
        $(this).val($(this).wpColorPicker('color')).trigger('change');
      },
    });
  }

  function wooct_active($form = null) {
    if ($form) {
      var active = $form.find('.wooct_active').val();

      if (active === 'yes') {
        $form.find('.form-field').show();
      } else {
        $form.find('.form-field').each(function() {
          if (!$(this).find('.wooct_active').length) {
            $(this).hide();
          }
        });
      }
    } else {
      $('.wooct_active').each(function() {
        var active = $(this).val();
        var $form = $(this).closest('.wooct_time_form');

        if (active === 'yes') {
          $form.find('.form-field').show();
        } else {
          $form.find('.form-field').each(function() {
            if (!$(this).find('.wooct_active').length) {
              $(this).hide();
            }
          });
        }
      });
    }
  }

  function wooct_time_type() {
    if ($('.wooct_time').length) {
      $('.wooct_time').each(function() {
        if ($(this).val() == 'custom') {
          $(this).
              closest('.wooct_time_form').
              find('.wooct_show_if_custom').
              show();
        } else {
          $(this).
              closest('.wooct_time_form').
              find('.wooct_show_if_custom').
              hide();
        }
      });
    }
  }

  function wooct_preview() {
    var data = {
      action: 'wooct_preview',
      nonce: wooct_vars.nonce,
      time_start: $('.wooct_time_start').val(),
      time_end: $('.wooct_time_end').val(),
      text_above: $('.wooct_text_above').val(),
      text_under: $('.wooct_text_under').val(),
      text_ended: $('.wooct_text_ended').val(),
      style: $('.wooct_style').val(),
      color: $('.wooct_color').val(),
    };

    $.post(ajaxurl, data, function(response) {
      $('.wooct_preview_inner').html(response);

      if ($('.wooct_style').val() === '04') {
        $('.wooct_preview_inner').css('background-color', '#333333');
      } else {
        $('.wooct_preview_inner').css('background-color', '');
      }

      wooct_init();
    });
  }

  function wooct_build_shortcode() {
    var time_start = $('.wooct_time_start').val();
    var time_end = $('.wooct_time_end').val();
    var text_above = $('.wooct_text_above').val();
    var text_under = $('.wooct_text_under').val();
    var text_ended = $('.wooct_text_ended').val();
    var style = $('.wooct_style').val();
    var color = $('.wooct_color').val();

    var shortcode = '[wooct style="' + style + '" color="' + color +
        '" time_start="' + time_start + '" time_end="' + time_end +
        '" text_above="' + wooct_html_entities(text_above) + '" text_under="' +
        wooct_html_entities(text_under) + '" text_ended="' +
        wooct_html_entities(text_ended) + '"]';

    $('.wooct_shortcode').val(shortcode);
  }

  function wooct_html_entities(str) {
    return String(str).
        replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/"/g, '&quot;');
  }
})(jQuery);