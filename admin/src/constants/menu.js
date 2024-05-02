import React, { useEffect } from 'react';

const MenuItems = () => {
    const sessionData = sessionStorage.getItem('hyper_user');
    const userData = JSON.parse(sessionData);
    const username = userData?.role || '';
    let MENU_ITEMS = []
    if (username === "Testing") {
        MENU_ITEMS = [
            { key: 'navigation', label: 'Navigation', isTitle: true },
            {
                key: 'dashboard',
                label: 'Dashboard',
                url: 'dashboard/adminsummary',
                icon: 'uil-window-grid',
            },
            {
                key: 'projectsss',
                label: 'Projects',
                url: 'dashboard/projects',
                icon: 'uil-home',
            },
            {
                key: 'alluser',
                label: 'All Users',
                url: 'dashboard/alluser',
                icon: 'uil-users-alt',
            },
            {
                key: 'logout',
                label: 'Logout',
                url: 'account/logout',
                icon: ' uil-entry',
            }
        ]
    } else if (username === "Admin") {
        MENU_ITEMS = [
            { key: 'navigation', label: 'Navigation', isTitle: true },
            {
                key: 'dashboard',
                label: 'Dashboard',
                url: 'dashboard/adminsummary',
                icon: 'uil-window-grid',
            },
            {
                key: 'projectsss',
                label: 'Projects',
                url: 'dashboard/projects',
                icon: 'uil-home',
            },

            {
                key: 'alluser',
                label: 'All Users',
                url: 'dashboard/alluser',
                icon: 'uil-users-alt',
            },
            {
                key: 'inviteuser',
                label: 'Invite Users',
                url: 'dashboard/inviteUser',
                icon: 'uil-user-plus',
            },
            {
                key: 'TechnologyCategory',
                label: 'Technology Category',

                icon: 'uil-technology',
                children: [
                    {
                        label: 'Category',
                        url: 'dashboard/technologyCategory',

                    }
                    , {
                        label: 'Technology',
                        parentKey: 'TechnologyCategory',
                        url: 'dashboard/technology',

                    },
                ]
            },
            {
                key: 'customer',
                label: 'Customer',
                url: 'dashboard/customer',
                icon: 'uil-users-alt',

            },
            // {
            //     key: 'client',
            //     label: 'Client',
            //     url: 'dashboard/client',
            //     icon: 'uil-users-alt',
            // },
            // {
            //     key: 'clientRepository',
            //     label: 'Client Repository',
            //     url: 'dashboard/clientRepository',
            //     icon: 'uil-users-alt',
            // },
            {
                key: 'timeTracker',
                label: 'Time Tracker',
                url: 'dashboard/timeTracker',
                icon: 'bi-clock',
            },
            {
                key: 'logout',
                label: 'Logout',
                url: 'account/logout',
                icon: ' uil-entry',
            }

        ]

    }

    return MENU_ITEMS;
}


export default MenuItems;
