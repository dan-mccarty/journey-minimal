
(function () {

    const DEVELOPMENT = fasle
    const baseUrl = DEVELOPMENT 
                        ? 'http://127.0.0.1:8000' 
                        : ''
                        
    const SESSION_START_URL = `${baseUrl}/api/session/start/`
    const TRACKING_URL = `${baseUrl}/api/track/`

    let session_id
    let interactions = []  // Store interactions
    let maxScrollDepth = 0

    // Function to fetch IP and location information
    async function fetchLocation() {
        let data
        try {
            const response = await fetch("https://ipapi.co/json/")
            data = await response.json()
        } catch (error) {
            console.error("Failed to fetch:", error)
        } return {
            ip_address: data.ip,
            city: data.city,
            state: data.region_code	,
            country: data.country_name,
        }
    }
    
    // Function to detect device information
    function getDeviceInfo() {
        const ua = navigator.userAgent
        let device_type = "desktop"
        let device_brand = "Unknown"
        let device_browser = "Unknown"
        if (/mobile/i.test(ua)) {
            device_type = "mobile"
        } else if (/tablet/i.test(ua)) {
            device_type = "tablet"
        }
        if (/Samsung/i.test(ua)) {
            device_brand = "Samsung"
        } else if (/iPhone|iPad/i.test(ua)) {
            device_brand = "Apple"
        } else if (/Pixel/i.test(ua)) {
            device_brand = "Google"
        }
        if (ua.includes('Firefox')) {
            device_browser = 'Firefox'
        } else if (ua.includes('Chrome')) {
            device_browser = 'Chrome'
        } else if (ua.includes('Safari')) {
            device_browser = 'Chrome'
        }
        return { 
            device_type, 
            device_brand, 
            device_browser
        }
    }

    // create a new session for interactions to be associated with
    async function create_session() {
        const device_info = getDeviceInfo()
        const location_info = await fetchLocation()
        const method = "POST"
        const body = JSON.stringify({
            ...location_info,
            ...device_info
        })
        const response = await fetch(SESSION_START_URL, { method, body})
        const json = await response.json()
        session_id = json['session_id']
    }

    function getPageFields(url) {
        let page_type = ''
        let page_value = ''
        url = url.replace('https://solarboxaustralia.au', '')
        if (url.includes('/products/')) {
            page_type = 'products'
            page_value = url.split('/products/')[1]
        } else if (url.includes('/collections/')) {
            page_type = 'collections'
            page_value = url.split('/collections/')[1]
        } else if (url.includes('/blogs/')) {
            page_type = 'blogs'
            page_value = url.split('/news/')[1]
        } else if (url.includes('/pages/')) {
            page_type = 'pages'
            page_value = url.split('/pages/')[1]
        }
        return [ 
            page_type, 
            page_value 
        ]
    }

    function addInteraction(event_type, event_value='') {
        const  timestamp = new Date().toISOString()
        const  referal_url = document.referrer
        const  page_url = window.location.href
        const  [ page_type, page_value ] = getPageFields(page_url)
        interactions.push({
            timestamp, 
            referal_url, 
            page_url, 
            page_type, 
            page_value,
            event_type, 
            event_value 
        })
    }

    // Post interactions periodically or when the user navigates away
    function flushInteractions() {
        if (interactions.length > 0) {
            navigator.sendBeacon(TRACKING_URL, JSON.stringify({ session_id, interactions }))
            interactions = []
        }
    }

    // Call this function when the page loads
    document.addEventListener("DOMContentLoaded", async () => {
        await create_session()
        addInteraction('page_load', '')
        flushInteractions()

        // Initiate event listeners
        // Periodically flush interactions
        setInterval(flushInteractions, 10000) // Every 10 seconds
        window.addEventListener("beforeunload", flushInteractions) // When navigating away
    
        // Track clicks
        document.addEventListener("click", (event) => {
            const list = Object.values(event.target.classList)
            if (list.includes('add-to-cart')) {
                addInteraction('button_click', 'add-to-cart')
            } else if (list.includes('cart__checkout')) {
                addInteraction('button_click', 'cart__checkout')
            } else if (event.target.id == 'checkout-pay-button') {
                addInteraction('button_click', 'checkout-pay-button')
            }
        })

        // Track scroll
        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY
            const scrollHeight =  document.body.scrollHeight
            const scrollDepth = Math.round((scrollY/scrollHeight) * 100)
            maxScrollDepth = Math.max([scrollDepth, maxScrollDepth])
            if (interactions.length) {
                const lastIndex  = interactions.length - 1
                if (interactions[lastIndex]['event_type'] == 'scroll') {
                    interactions[lastIndex]['timestamp'] = new Date().toISOString()
                    interactions[lastIndex]['event_value'] = maxScrollDepth
                } else {
                    addInteraction('scroll', maxScrollDepth)
                }
            }
        })

    })
    
})()


