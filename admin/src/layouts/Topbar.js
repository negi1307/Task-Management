// @flow
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import '../global.css';

// actions
import {
    showRightSidebar,
    changeSidebarType,
    getsingleMileStone,
    getMilestonetId,
    getSprintId,
} from '../redux/actions';
import { getAllProjects } from '../../src/redux/projects/action';
import { getallMileStones, getMileStoneById } from '../redux/actions';
import { getAllSprint, getSingleSprint } from '../redux/actions';
// components
import LanguageDropdown from '../components/LanguageDropdown';
import NotificationDropdown from '../components/NotificationDropdown';
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
import { getProjectId } from '../redux/projects/action';
//constants
import * as layoutConstants from '../constants/layout';
import TimeLine from './../pages/profile2/TimeLine';
import MileStone from './../pages/Task-Manager/AllMillstones/mileStone/index';

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
    const [isopen, setIsopen] = useState(false);
    // const allProjects = store?.getProject?.data?.response;
    // const getsingleMilestoneData = store?.getSigleMileStone?.data?.response;
    // console.log(getsingleMilestoneData, "responseeeeeeeeeeeeeeeeee")
    // const getAllSingleSprints = store?.getAllSingleSprints?.data?.response;

    // const [mileStoneId, setMileStoneId] = useState('');
    // const [sprintId, setSprintId] = useState('');
    // const [mileStoneData, setmileStoneData] = useState([]);
    // const [milestoneid, setmilestoneid] = useState(false);
    // const [sptint, setsprint] = useState(false);

    const navbarCssClasses = navCssClasses || '';
    const containerCssClasses = !hideLogo ? 'container-fluid' : '';

    const { layoutType, leftSideBarType } = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
    }));

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

    // const handleProject = () => {
    //     setmilestoneid(false);

    //     let data = {
    //         status: 1,
    //         skip: 1,
    //     };
    //     dispatch(getAllProjects(data));
    // };
    // const onChangeProject = (e) => {
    //     setsprint(false);

    //     dispatch(getProjectId(e.target.value));

    //     const id = e.target.value;
    //     setmilestoneid(true);
    //     if (id) {
    //         dispatch(getsingleMileStone({ id: id, activeStatus: 1, skip: 0, mileStoneId: "" }));
    //     }

    // };
    // const onChangeMilestone = (e) => {

    //     dispatch(getMilestonetId(e.target.value))
    //     const id = e?.target.value;
    //     setsprint(true);

    //     dispatch(getSingleSprint({ activeStatus: 1, id: id, skip: 0 }));

    // };
    // const sprinthandel = (e) => {
    //     dispatch(getSprintId(e.target.value));
    //     setsprint(false);

    // }
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
                        <div className="d-flex align-items-center">
                            <div className="lefbar_info">
                                {(layoutType === layoutConstants.LAYOUT_VERTICAL ||
                                    layoutType === layoutConstants.LAYOUT_FULL) && (
                                    <button className="button-menu-mobile open-left" onClick={handleLeftMenuCallBack}>
                                        <i className="mdi mdi-menu" />
                                    </button>
                                )}
                                <div class="menuinfo">
                                    <ul>
                                        <li className="list_padding">
                                            <Link to="">Apps</Link>
                                        </li>
                                        <li className="list_padding">
                                            <Link to="">Filters</Link>
                                        </li>
                                        <li className="list_padding">
                                            <Link to="">Dashboard</Link>
                                        </li>
                                        <li className="list_padding">
                                            <Link to="">Teams</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* <div className="dropdown mx-2">
                                <button className=" bg-white border-0 dropdown-toggle" type="button" id="dropdownMenuButton" data-mdb-toggle="dropdown" aria-expanded="false"
                                    onClick={handleProject}>
                                    Projects
                                </button>
                                    <ul className="dropdown-menu border_zero" aria-labelledby="dropdownMenuButton">
                                        <li>
                                            {allProjects?.map((item, index) => (
                                                <li className="dropdown-item"
                                                    onClick={onChangeProject}
                                                >
                                                    <option className="project_opt" key={index} value={item?._id}
                                                    >
                                                        {item?.projectName}
                                                    </option>
                                                </li>
                                            ))}
                                            {getsingleMilestoneData?.length ? (
                                                <ul className="dropdown-menu dropdown-submenu border_zero  ">
                                                    <li>
                                                        {getsingleMilestoneData?.map((item, index) => (
                                                            <option className="project_opt drop_s" onClick={onChangeMilestone} key={index} value={item?._id}
                                                            >
                                                                {item?.title}
                                                            </option>
                                                        ))}

                                                        {sptint ? (
                                                            <ul className="dropdown-menu dropdown-submenu border_zero ">
                                                                {getAllSingleSprints?.map((item, index) => (
                                                                    <li
                                                                    >
                                                                        <option className="dropdown-item drop_s"
                                                                            onClick={sprinthandel} key={index} value={item?._id}>
                                                                            {item?.sprintName}
                                                                        </option>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (<div></div>)}
                                                    </li>
                                                </ul>
                                            ) : (<div></div>)}

                                        </li>
                                    </ul>
                            </div> */}
                        </div>

                        <ul className="list-unstyled topbar-menu float-end mb-0 topbarr">
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
        </>
    );
};

export default Topbar;
