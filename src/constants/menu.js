const data = [{
    id: "dashboards",
    icon: "iconsminds-shop-4",
    label: "menu.dashboard",
    to: "/app/dashboards/content"
},
{
    id: "user-profile",
    icon: "iconsminds-male-2",
    label: "menu.my-account",
    to: "/app/users/user-profile"
},
{
    id: "members",
    icon: "iconsminds-business-man-woman",
    label: "menu.members",
    to: "/app/members/member-list",
},
{
    id: "transactions",
    icon: "iconsminds-coins",
    label: "menu.transactions",
    to: "/app/members/transaction-list",
},
{
    id: "contributions",
    icon: "iconsminds-financial",
    label: "menu.contributions",
    to: "/app/members/contributions-list",
},
{
    id: "investments",
    icon: "iconsminds-line-chart-3",
    label: "menu.investments",
    to: "/app/members/investments-list",
},
{
    id: "settings",
    icon: "simple-icon-settings",
    label: "menu.settings",
    to: "/app/settings",
    subs: [{
        id: "settings-users",
        label: "menu.users-manage",
        to: "/app/settings/users",
        subs: [
            {
                icon: "iconsminds-network",
                label: "menu.users",
                to: "/app/settings/users/user-list"
            },
            {
                icon: "iconsminds-business-man-woman",
                label: "menu.members",
                to: "/app/settings/members/member-list"
            }
        ]
    },
    {
        id: "settings-security",
        label: "menu.security",
        to: "/app/settings/security",
        subs: [{
            icon: "iconsminds-security-settings",
            label: "menu.roles",
            to: "/app/settings/security/role"
        }, {
            icon: "iconsminds-key-lock",
            label: "menu.permissions",
            to: "/app/settings/security/permission"
        }]
    },
    {
        id: "settings-system",
        label: "menu.system",
        to: "/app/settings/system",
        subs: [{
            icon: "iconsminds-money-bag",
            label: "menu.global",
            to: "/app/settings/system/global"
        }, {
            icon: "iconsminds-money-bag",
            label: "menu.upload-center",
            to: "/app/settings/system/upload-center"
        }]
    }]
},
{
    id: "ui",
    icon: "iconsminds-pantone",
    label: "menu.ui",
    to: "/app/ui",
    subs: [

        {
            id: "ui-forms",
            label: "menu.forms",
            to: "/app/ui/forms",
            subs: [{
                icon: "simple-icon-notebook",
                label: "menu.layouts",
                to: "/app/ui/forms/layouts"
            },
            {
                icon: "simple-icon-puzzle",
                label: "menu.components",
                to: "/app/ui/forms/components"
            },
                {
                    icon: "simple-icon-check",
                    label: "menu.validations",
                    to: "/app/ui/forms/validations"
                },
                {
                    icon: "simple-icon-magic-wand",
                    label: "menu.wizard",
                    to: "/app/ui/forms/wizard"
                }
            ]
        },
        {
            id: "ui-components",
            label: "menu.components",
            to: "/app/ui/components",
            subs: [{
                icon: "simple-icon-bell",
                label: "menu.alerts",
                to: "/app/ui/components/alerts"
            },
            {
                icon: "simple-icon-badge",
                label: "menu.badges",
                to: "/app/ui/components/badges"
            },
            {
                icon: "simple-icon-control-play",
                label: "menu.buttons",
                to: "/app/ui/components/buttons"
            },
            {
                icon: "simple-icon-layers",
                label: "menu.cards",
                to: "/app/ui/components/cards"
            },
            {
                icon: "simple-icon-picture",
                label: "menu.carousel",
                to: "/app/ui/components/carousel"
            },
            {
                icon: "simple-icon-chart",
                label: "menu.charts",
                to: "/app/ui/components/charts"
            },
            {
                icon: "simple-icon-arrow-up",
                label: "menu.collapse",
                to: "/app/ui/components/collapse"
            },
            {
                icon: "simple-icon-arrow-down",
                label: "menu.dropdowns",
                to: "/app/ui/components/dropdowns"
            },
            {
                icon: "simple-icon-book-open",
                label: "menu.editors",
                to: "/app/ui/components/editors"
            },

            {
                icon: "simple-icon-star",
                label: "menu.icons",
                to: "/app/ui/components/icons"
            },
            {
                icon: "simple-icon-note",
                label: "menu.input-groups",
                to: "/app/ui/components/input-groups"
            },
            {
                icon: "simple-icon-screen-desktop",
                label: "menu.jumbotron",
                to: "/app/ui/components/jumbotron"
            },
            {
                icon: "simple-icon-map",
                label: "menu.maps",
                to: "/app/ui/components/maps"
            },
            {
                icon: "simple-icon-docs",
                label: "menu.modal",
                to: "/app/ui/components/modal"
            },
            {
                icon: "simple-icon-cursor",
                label: "menu.navigation",
                to: "/app/ui/components/navigation"
            },
            {
                icon: "simple-icon-pin",
                label: "menu.popover-tooltip",
                to: "/app/ui/components/popover-tooltip"
            },
            {
                icon: "simple-icon-shuffle",
                label: "menu.sortable",
                to: "/app/ui/components/sortable"
            },
            {
                icon: "simple-icon-grid",
                label: "menu.tables",
                to: "/app/ui/components/tables"
            }
            ]
        }
    ]
},
{
    id: "menu",
    icon: "iconsminds-three-arrow-fork",
    label: "menu.menu",
    to: "/app/menu",
    subs: [{
        icon: "simple-icon-logout",
        label: "menu.types",
        to: "/app/menu/types"
    },
    {
        icon: "simple-icon-layers",
        label: "menu.levels",
        to: "/app/menu/levels",
        subs: [{
            icon: "simple-icon-arrow-right",
            label: "menu.third-level-1",
            to: "/app/menu/levels/third-level-1"
        },
        {
            icon: "simple-icon-arrow-right",
            label: "menu.third-level-2",
            to: "/app/menu/levels/third-level-2"
        },
        {
            icon: "simple-icon-arrow-right",
            label: "menu.third-level-3",
            to: "/app/menu/levels/third-level-3"
        }
        ]
    }
    ]
 }
];
export default data;