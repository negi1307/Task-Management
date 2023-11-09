// @flow
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import MainLoader from '../constants/Loader/loader';

// actions
import { showRightSidebar, changeSidebarType } from '../redux/actions';
import { getAllProjects } from '../../src/redux/projects/action';
import { getallMileStones, getMileStoneById } from '../redux/actions';
import { getAllSprint, getSingleSprint } from '../redux/actions';
// components
// import LanguageDropdown from '../components/LanguageDropdown';
// import NotificationDropdown from '../components/NotificationDropdown';
import ProfileDropdown from '../components/ProfileDropdown';
import SearchDropdown from '../components/SearchDropdown';
import TopbarSearch from '../components/TopbarSearch';
import AppsDropdown from '../components/AppsDropdown/';

// images
import profilePic from '../assets/images/users/avatar-1.jpg';
import avatar1 from '../assets/images/users/avatar-2.jpg';
import avatar2 from '../assets/images/users/avatar-4.jpg';
import logoSmDark from '../assets/images/logo_sm_dark.png';
import logoSmLight from '../assets/images/logo_sm.png';
import logo from '../assets/images/logo-light.png';
import Boards from '../pages/Task-Manager/board/board';
import RightBar from './AddRightSideBar';

//constants
import * as layoutConstants from '../constants/layout';
import TimeLine from './../pages/profile2/TimeLine';
import MileStone from './../pages/Task-Manager/AllMillstones/mileStone/index';
import { getProjectMilestones } from '../../src/redux/milestone/action';
import { getAllMilstoneSprints } from '../../src/redux/sprint/action';
import { getsingleMileStone, getMileStonebyprojectid } from '../../src/redux/milestone/action';
import { getProjectsById } from '../../src/redux/projects/action';
import { getProjectId } from '../../src/redux/projects/action';
import { getMilestoneId } from '../../src/redux/milestone/action';
import { getSprintId } from '../../src/redux/sprint/action';
import { getTaskStatusCount } from '../../src/redux/Summary/action';
import {addLoginTime} from '../../src/redux/user/action'

// get the notifications
const Notifications = [
    {
        day: 'Today',
        messages: [
            {
                id: 1,
                title: 'Datacorp',
                subText: 'Caleb Flakelar commented on Admin',
                time: '1 min ago',
                icon: 'mdi mdi-comment-account-outline',
                variant: 'primary',
                isRead: false,
            },
            {
                id: 2,
                title: 'Admin',
                subText: 'New user registered.',
                time: '1 hours ago',
                icon: 'mdi mdi-account-plus',
                variant: 'info',
                isRead: true,
            },
        ],
    },
    {
        day: 'Yesterday',
        messages: [
            {
                id: 1,
                title: 'Cristina Pride',
                subText: 'Hi, How are you? What about our next meeting',
                time: '1 day ago',
                avatar: avatar1,
                isRead: true,
            },
        ],
    },
    {
        day: '30 Dec 2021',
        messages: [
            {
                id: 1,
                title: 'Datacorp',
                subText: 'Caleb Flakelar commented on Admin',
                icon: 'mdi mdi-comment-account-outline',
                variant: 'primary',
                isRead: true,
            },
            {
                id: 2,
                title: 'Karen Robinson',
                subText: 'Wow ! this admin looks good and awesome design',
                avatar: avatar2,
                isRead: true,
            },
        ],
    },
];

// get the profilemenu
const ProfileMenus = [
    {
        label: 'My Account',
        icon: 'mdi mdi-account-circle',
        redirectTo: '#',
    },
    {
        label: 'Settings',
        icon: 'mdi mdi-account-edit',
        redirectTo: '#',
    },
    {
        label: 'Support',
        icon: 'mdi mdi-lifebuoy',
        redirectTo: '#',
    },
    {
        label: 'Lock Screen',
        icon: 'mdi mdi-lock-outline',
        redirectTo: '/account/lock-screen',
    },
    {
        label: 'Logout',
        icon: 'mdi mdi-logout',
        redirectTo: '/account/logout',
    },
];

type TopbarProps = {
    hideLogo?: boolean,
    navCssClasses?: string,
    openLeftMenuCallBack?: () => void,
    topbarDark?: boolean,
};

const Topbar = ({ hideLogo, navCssClasses, openLeftMenuCallBack, topbarDark }: TopbarProps): React$Element<any> => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    console.log('storeeeeeee', store);
    const [isopen, setIsopen] = useState(false);
    const [startLoginTime,setLoginTime]=useState(false)
    const allProjects = store?.getProject?.data?.response;
    const loginTimeMessage=store?.createUserTime?.message;
    const getAllMilestoneData = store?.getSigleMileStone?.data?.response;
    const getAllSingleSprints = store?.getAllSingleSprints?.data?.Response;
    //=====================================user login time=========================================================
        useEffect(()=>{
            
                dispatch(addLoginTime())
                
        
        },[])
    //=======================================user login time=================================================================

    const [projectNameHeading, setProjectName] = useState('Select Project Name');

    const navbarCssClasses = navCssClasses || '';
    const containerCssClasses = !hideLogo ? 'container-fluid' : '';

    const { layoutType, leftSideBarType } = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
    }));

    useEffect(() => {
        let data = {
        
            status: 1,
            projectstatus:1            
        };
        dispatch(getAllProjects(data));
        //dispatch(getallMileStones({status:1}))
        // dispatch(getProjectMilestones({projectId:projectId,status:1}))
    }, []);

    const onChangeProject = (e) => {
        if (e.target.value !== '') {
            const projectData = allProjects?.filter((item) => item._id == e.target.value);
            setProjectName(projectData[0].projectName);
            dispatch(getProjectId(e.target.value));
            dispatch(getsingleMileStone({ id: e.target.value, status: 1 }));
        }
    };
    const onChangeMilestone = (e) => {
        if (e.target.value !== '') {
            dispatch(getMilestoneId(e.target.value));
            dispatch(getAllMilstoneSprints({ milestoneId: e.target.value, status: 1 }));
        }
    };
    const onChangeSprint = (e) => {
        //setSprintId(e.target.value)
        if (e.target.value !== '') {
            dispatch(getSprintId(e.target.value));
            dispatch(getTaskStatusCount());
        }
    };

    /**
     * Toggle the leftmenu when having mobile screen
     */
    const handleLeftMenuCallBack = () => {
        setIsopen((prevState) => !prevState);
        if (openLeftMenuCallBack) openLeftMenuCallBack();

        switch (layoutType) {
            case layoutConstants.LAYOUT_VERTICAL:
                // condition added
                if (window.innerWidth >= 768) {
                    if (leftSideBarType === 'fixed' || leftSideBarType === 'scrollable')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED));
                    if (leftSideBarType === 'condensed')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED));
                }
                break;

            case layoutConstants.LAYOUT_FULL:
                if (document.body) {
                    document.body.classList.toggle('hide-menu');
                }
                break;
            default:
                break;
        }
    };

    /**
     * Toggles the right sidebar
     */
    const handleRightSideBar = () => {
        dispatch(showRightSidebar());
    };
    const loginTime=()=>{
        alert(loginTimeMessage.message)
    }
    return (
        <>
            <div className={classNames('navbar-custom', navbarCssClasses)}>
                <div className={containerCssClasses}>
                    <div className="topbarinfo">
                        {!hideLogo && (
                            <Link to="/" className="topnav-logo">
                                <span className="topnav-logo-lg">
                                    <img src={logo} alt="logo" height="16" />
                                </span>
                                <span className="topnav-logo-sm">
                                    <img src={topbarDark ? logoSmLight : logoSmDark} alt="logo" height="16" />
                                </span>
                            </Link>
                        )}
                        <div className="lefbar_info">
                            {(layoutType === layoutConstants.LAYOUT_VERTICAL ||
                                layoutType === layoutConstants.LAYOUT_FULL) && (
                                <button className="button-menu-mobile open-left" onClick={handleLeftMenuCallBack}>
                                    <i className="mdi mdi-menu" />
                                </button>
                            )}
                            <div class="menuinfo">
                                <ul>
                                    <li>
                                        <Link to="" className="list_padding">
                                            Apps
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="" className="list_padding">
                                            Filters
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="" className="list_padding">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="" className="list_padding">
                                            Teams
                                        </Link>
                                    </li>
                                    <li>
                                        <div class="project_names">
                                            <select
                                                name="ddlProject"
                                                class="form-select "
                                                id="exampleForm.ControlInput1"
                                                onChange={onChangeProject}>
                                                <option>Projects</option>
                                                {allProjects?.map((item, index) => (
                                                    <option key={index} value={item._id}>
                                                        {item.projectName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="project_names">
                                            <select
                                                name="ddlMilestone"
                                                class="form-select "
                                                id="exampleForm.ControlInput1"
                                                onChange={onChangeMilestone}>
                                                <option> MileStone</option>
                                                {getAllMilestoneData?.map((item, index) => (
                                                    <option key={index} value={item._id}>
                                                        {item.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </li>
                                    
                                    <li>
                                        <div class="project_names">
                                            <select
                                                name="ddlSprint"
                                                class="form-select "
                                                id="exampleForm.ControlInput1"
                                                onChange={onChangeSprint}>
                                                <option> Sprint</option>
                                                {getAllSingleSprints?.map((item, index) => (
                                                    <option key={index} value={item._id}>
                                                        {item.sprintName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </li>
                                    {/* <li>
                            <div class="project_names">
                                                        <select name="Assignee" class="form-select" id="exampleForm.ControlInput1" onChange={onChangeProject}>
                                <option>--Select Project--</option>
                                {allProjects?.map((item,index)=>
                                    <option key={index} value={item._id}>{item.projectName}</option>
                                )}
                            </select>
                            <select name="Assignee" class="form-select" id="exampleForm.ControlInput1" onChange={onChangeMilestone}>
                                <option>--Select MileStone--</option>
                                {getAllMilestoneData?.map((item,index)=>
                                    <option key={index} value={item._id}>{item.title}</option>
                                )}
                            </select>
                            <select name="Assignee" class="form-select" id="exampleForm.ControlInput1" onChange={onChangeSprint}>
                                <option>--Select Sprint--</option>
                                {getAllSingleSprints?.map((item,index)=>
                                    <option key={index} value={item._id}>{item.sprintName}</option>
                                )}
                            </select>
                            </div>
                            </li> */}
                            <li>
                                        <button type="submit" onClick={loginTime}>
                                                    Start 
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <ul className="list-unstyled topbar-menu float-end mb-0 topbarr">
                            {/*                    
                        <li className="notification-list topbar-dropdown d-xl-none">
                            <SearchDropdown />
                        </li>
                        
                        <li className="dropdown notification-list topbar-dropdown d-none d-lg-block">
                            <LanguageDropdown />
                        </li> 
                         <li className="dropdown notification-list">
                            <NotificationDropdown notifications={Notifications} />
                        </li> 
                        <li className="dropdown notification-list d-none d-sm-inline-block">
                            <AppsDropdown />
                        </li>  */}

                            <li className="notification-list">
                                <button
                                    className="nav-link dropdown-toggle end-bar-toggle arrow-none btn btn-link shadow-none"
                                    onClick={handleRightSideBar}>
                                    <i className="dripicons-gear noti-icon"></i>
                                </button>
                            </li>
                            <li className="dropdown notification-list listlist">
                                <ProfileDropdown
                                    profilePic={profilePic}
                                    menuItems={ProfileMenus}
                                    username={store?.Auth?.user?.username}
                                    userTitle={store?.Auth?.user?.firstName}
                                />
                            </li>
                        </ul>

                        {/* {/ toggle for vertical layout /} */}

                        {/* {/ toggle for horizontal layout /} */}
                        {layoutType === layoutConstants.LAYOUT_HORIZONTAL && (
                            <Link
                                to="#"
                                className={classNames('navbar-toggle', { open: isopen })}
                                onClick={handleLeftMenuCallBack}>
                                <div className="lines">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </Link>
                        )}

                        {/* {/ toggle for detached layout /} */}
                        {layoutType === layoutConstants.LAYOUT_DETACHED && (
                            <Link to="#" className="button-menu-mobile disable-btn" onClick={handleLeftMenuCallBack}>
                                <div className="lines">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </Link>
                        )}
                        <TopbarSearch />
                    </div>
                </div>
            </div>
            <div className="project_detail">
                <div className="project_name">
                    <h3>{projectNameHeading}</h3>
                </div>
                <div className="taskinfo">
                    <ul>
                        <li>
                            {' '}
                            <Link to="summary">Summary</Link>{' '}
                        </li>
                        {/* <li> <Link to="/tasklist">List</Link> </li> */}
                        <li> <Link to="/boards">Board</Link>  </li>
                    

                    </ul>
                </div>
            </div>
        </>
    );
};

export default Topbar;
