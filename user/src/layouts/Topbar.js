// @flow
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import MainLoader from '../constants/Loader/loader';
import moment from 'moment';
import Clock from 'react-live-clock';


// actions
import { showRightSidebar, changeSidebarType } from '../redux/actions';
// import { getAllProjects } from '../../src/redux/projects/action';
import { getallMileStones, getMileStoneById } from '../redux/actions';
import { getAllSprint, getSingleSprint } from '../redux/actions';
import { updateTaskStatusTime } from '../../src/redux/task/action'
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
import { addLoginTime, addLoginTimeStop } from '../../src/redux/user/action';
import Filter from '../pages/Task-Manager/board/Modal/Filter';
import { useParams } from 'react-router-dom';
import Buttons from '../pages/uikit/Buttons';
import ToastHandle from '../constants/toaster/toaster';
import { Button } from 'react-bootstrap';
import { useStopwatch, useTime } from 'react-timer-hook';
import { getAllLogoutReason } from '../../src/redux/user/action'
import Modal from 'react-bootstrap/Modal';

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
    const [startLoginTime, setLoginTime] = useState(false);
    const [loginTimee, setLoginTimee] = useState();
    const allProjects = store?.getProject?.data?.response;
    const loginTimeMessage = store?.createUserTime;
    const getAllMilestoneData = store?.getSigleMileStone?.data?.response;
    const getAllSingleSprints = store?.getAllSingleSprints?.data?.Response;
    const { projectId, milestoneId, spriteId } = useParams();
    const getLeaveDetails = store?.getUserLogoutReason?.data?.response

    const [projectNameHeading, setProjectName] = useState('Select Project Name');

    const navbarCssClasses = navCssClasses || '';
    const containerCssClasses = !hideLogo ? 'container-fluid' : '';

    const { layoutType, leftSideBarType } = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
    }));


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
    const [modal, setModal] = useState(false);
    const closemodal = () => {
        setModal(false);
    };
    /**
     * Toggles the right sidebar
     */
    const handleRightSideBar = () => {
        dispatch(showRightSidebar());
    };
    const [showButton, setShowButton] = useState();
    useEffect(() => {
        if (sessionStorage?.getItem('startButton')) {
            setShowButton(false);
        } else {
            setShowButton(true);
        }
    }, []);
    const token = sessionStorage.getItem('hyper_user');
    const loginTime = () => {
        dispatch(addLoginTime());
        sessionStorage.setItem('startButton', true);
        if (sessionStorage?.getItem('startButton')) {
            setShowButton(false);
        }
    };
    const [leave, setLeave] = useState('');
    useEffect(() => {
        if (loginTimeMessage?.data?.status == 200) {
            ToastHandle('success', loginTimeMessage?.data?.message);
            setLoginTimee(loginTimeMessage?.data?.loginTime);
        }
    }, [loginTimeMessage]);
    useEffect(() => {
        dispatch(getAllLogoutReason())
    }, [])
    const logoutTime = () => {
        if (leave !== "") {
            dispatch(addLoginTimeStop({ leaveMessageId: leave }));
            sessionStorage.removeItem('startButton');
            setShowButton(true);
        }
        else {
            handleShow();
        }
    };

    const onChangeLeave = (e) => {
        setLeave(e.target.value);
        handleClose();
    }


    const [time, setTime] = useState(1);
    const start = sessionStorage.getItem('startButton');
    const [incrementValue, setIncrementValue] = useState(0);
    const increment = () =>
        setTime((prevTime) => {
            return prevTime === 0 ? 0 : prevTime + 1;
        });

    useEffect(() => {
        if (start) {
            setIncrementValue(setInterval(increment, 1000));
        }
        else {
            clearInterval(incrementValue);
        }
        return () => clearInterval(incrementValue);
    }, [start]);

    const format = (num: number): string => {
        return num < 10 ? '0' + num : num.toString();
    };

    //const days = format(Math.floor(time / (3600 * 24)));
    const hours = format(Math.floor((time / 3600) % 24));
    const minutes = format(Math.floor((time / 60) % 60));
    const seconds = format(time % 60);
    if (start) {
        localStorage.setItem("hours", hours);
        localStorage.setItem("minutes", minutes);
        localStorage.setItem("seconds", seconds);
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
                            <div className="menuinfo">
                                <Clock
                                    className='fw-bold text-black fs-5'
                                    format={'HH:mm:ss'}
                                    ticking={true}
                                    timezone={'Asia/Kolkata'} />
                            </div>
                            {/* <div class="menuinfo">
                                <ul>

                                    {showButton ? (
                                        <li>
                                            <Button type="submit" onClick={loginTime}>
                                                Start
                                            </Button>
                                        </li>
                                    ) : (
                                        <li>
                                            <Button type="submit" onClick={logoutTime}>
                                                Stop
                                            </Button>
                                        </li>
                                    )}
                                    <li>
                                        {localStorage.getItem("hours") +
                                            ':' + localStorage.getItem('minutes') +
                                            ':' + localStorage.getItem('seconds')}

                                    </li>

                                </ul>
                            </div> */}
                        </div>
                        <ul className="list-unstyled topbar-menu float-end mb-0 topbarr">
                            <li className="dropdown notification-list listlist">
                                <ProfileDropdown
                                    profilePic={profilePic}
                                    menuItems={ProfileMenus}
                                    username={store?.Auth?.user?.username}
                                    firstName={store?.Auth?.user?.firstName}
                                    lastName={store?.Auth?.user?.lastName}

                                />
                                {/* <Link to="/account/logout" onClick={logouttimeinfo}>logout</Link> */}

                            </li>

                        </ul>
                        {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Select Reason for Leave</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='reason_type'>
                                <ul>
                                    <li className='leave_data'>

                                        <select id="leave" onChange={onChangeLeave} name="cars" disabled={showButton}>
                                            <option value="" >Select Reason</option>
                                            {getLeaveDetails?.map((item, index) =>
                                                <option key={index} value={item?._id} >{item?.leaveReason}</option>
                                            )}



                                        </select>
                                    </li>
                                </ul>
                            </Modal.Body>
                            <Modal.Footer>
                                {/* <Button variant="secondary" onClick={handleClose}>
         
          </Button>
          <Button variant="primary" onClick={handleClose}>
         
          </Button> */}
                            </Modal.Footer>
                        </Modal>


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
            {/* <div className="project_detail">
                <div className="project_name">
                    <h3>{projectNameHeading}</h3>
                </div>
                <div className="taskinfo">
                    <ul>
                        <li>
                            {' '}
                            <Link to="summary">Summary</Link>{' '}
                        </li>
                        <li>
                            {' '}
                            <Link to="/tasklist">List</Link>{' '}
                        </li>
                        <li>
                            {' '}
                            <Link to="/boards">Board</Link>{' '}
                        </li>
                    </ul>
                </div>
            </div> */}
            <Filter modal={modal} closeModal={closemodal} />
        </>
    );
};

export default Topbar;
