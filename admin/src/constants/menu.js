 const MENU_ITEMS = [
    { key: 'navigation', label: 'Navigation', isTitle: true },
    {
        key: 'projectsss',
        label: 'Projects',
        url: 'dashboard/projects',
        icon: 'uil-home',
    },
    // {
    //     key: 'boards',
    //     label: 'Boards',
    //     url: 'dashboard/boards',
    //     icon: 'uil-chart',
    // },
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
        children:[
            {
                label: 'Category',
                url: 'dashboard/technologyCategory',
                
            }
            ,{
                label: 'Technology',
                parentKey: 'TechnologyCategory',
                url: 'dashboard/technology',
                
            },
        ]
    },
    // {
    //     key: 'technology',
    //     label: 'Technology',
    //     url: 'dashboard/technology',
    //     icon: 'uil-technology',

    // },
   
  
];


export default MENU_ITEMS;
