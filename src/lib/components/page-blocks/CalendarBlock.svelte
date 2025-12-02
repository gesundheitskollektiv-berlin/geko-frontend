<script>
  import { slugify } from '$lib/helpers/landingBlocks';

  export let data = {};
  export let events = [];

  // data and events are kept for future calendar implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = { data, events };

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'calendar';
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-7 col-md-10">
          <!-- TODO: Implement calendar component -->
          <!-- Calendar will be implemented with FullCalendar or similar -->
          <div class="pb-3 text-center" id="calendar-title"></div>
          <div id="calendar"></div>

          <div id="calendar-legend" class="pt-3">
            <ul>
              <li class="background-color-blue calendar-legend-item">
                <span>
                  Im
                  <a class="text-decoration-underline" href="#block-4"
                    >Geko Stadtteil-Gesundheits-Zentrum</a
                  >
                </span>
              </li>
              <li class="background-color-yellow calendar-legend-item">
                <span>Im Kiez</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</section>
