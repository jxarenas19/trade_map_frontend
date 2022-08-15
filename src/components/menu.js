export const menuItems = [
    // {
    //     id: 1,
    //     label: "menuitems.menu.text",
    //     isTitle: true
    //},
    {
        id: 2,
        label: 'menuitems.dashboard.text',
        icon: 'ri-dashboard-line',
        badge: {
            variant: "success",
            text: "menuitems.dashboard.badge"
        },
        link: '/'
    },
    {
        id: 3,
        label: 'menuitems.competitive.text',
        icon: 'ri-calendar-2-line',
        link: '/competitive'
    },
    {
        id: 4,
        label: 'menuitems.analysis.text',
        icon: 'ri-bar-chart-line',
        subItems: [
            {
                id: 5,
                label: 'menuitems.analysis.list.iemi_service',
                link: '/analysis/iemi_service'
            },
            {
                id: 6,
                label: 'menuitems.analysis.list.server_service',
                link: '/analysis/server_service'
            },
            {
                id: 7,
                label: 'menuitems.analysis.list.remote_service',
                link: '/analysis/remote_service'
            }
        ]
    },
    {
        id: 8,
        label: 'menuitems.adjust.text',
        icon: 'ri-profile-line',
        subItems: [
            {
                id: 9,
                label: 'menuitems.adjust.list.general',
                link: '/adjust/general'
            },
            {
                id: 10,
                label: 'menuitems.adjust.list.coins',
                link: '/adjust/coins'
            },
            {
                id: 11,
                label: 'menuitems.adjust.list.users',
                link: '/adjust/users'
            }
        ]
    }

]